import { useCallback, useEffect, useRef, useState } from "react";

const FPS = 24;
const CAP_W = 1600;
const CAP_H = 900;

export function useVideoFrameCache({
  videoRef,
  canvasRef,
  videoSrc,
  fallbackStartSrc,
  fallbackEndSrc,
}) {
  const framesRef = useRef([]);
  const nfRef = useRef(121);
  const wantRef = useRef(0);
  const drawnRef = useRef(-1);
  const busyRef = useRef(false);
  const readyRef = useRef(false);
  const [frame0Ready, setFrame0Ready] = useState(false);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      drawnRef.current = -1;
    }
  }, [canvasRef]);

  const findNearestCachedIndex = useCallback((target) => {
    const frames = framesRef.current;
    const nf = nfRef.current;
    if (frames[target]) return target;
    for (let offset = 1; offset < nf; offset += 1) {
      const right = target + offset;
      if (right < nf && frames[right]) return right;
      const left = target - offset;
      if (left >= 0 && frames[left]) return left;
    }
    return -1;
  }, []);

  const drawWant = useCallback(
    (targetIndex) => {
      const nf = nfRef.current;
      const clampedTarget = Math.min(nf - 1, Math.max(0, Math.round(targetIndex)));
      wantRef.current = clampedTarget;

      if (busyRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const idx = findNearestCachedIndex(clampedTarget);
      if (idx === -1 || idx === drawnRef.current) return;

      const blob = framesRef.current[idx];
      if (!blob) return;

      busyRef.current = true;
      createImageBitmap(blob)
        .then((bitmap) => {
          try {
            const c = canvasRef.current;
            if (!c) return;
            const ctx = c.getContext("2d");
            if (!ctx) return;

            const cw = c.width;
            const ch = c.height;
            const bw = bitmap.width;
            const bh = bitmap.height;
            const scale = Math.max(cw / bw, ch / bh);
            const dw = bw * scale;
            const dh = bh * scale;
            const dx = (cw - dw) * 0.5;
            const dy = (ch - dh) * 0.5;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(bitmap, dx, dy, dw, dh);
            drawnRef.current = idx;
          } finally {
            bitmap.close();
          }
        })
        .catch(() => {})
        .finally(() => {
          busyRef.current = false;
          if (wantRef.current !== drawnRef.current) {
            const nextIdx = findNearestCachedIndex(wantRef.current);
            if (nextIdx !== -1 && nextIdx !== drawnRef.current) {
              drawWant(wantRef.current);
            }
          }
        });
    },
    [canvasRef, findNearestCachedIndex]
  );

  useEffect(() => {
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize, { passive: true });
    return () => window.removeEventListener("resize", syncCanvasSize);
  }, [syncCanvasSize]);

  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;
    if (!video) return undefined;

    const capCanvas = document.createElement("canvas");
    capCanvas.width = CAP_W;
    capCanvas.height = CAP_H;
    const capCtx = capCanvas.getContext("2d");

    const captureCurrentFrame = (index, quality = 0.86) =>
      new Promise((resolve) => {
        if (!capCtx || cancelled) {
          resolve(null);
          return;
        }
        try {
          capCtx.drawImage(video, 0, 0, CAP_W, CAP_H);
          capCanvas.toBlob(
            (blob) => {
              if (!cancelled && blob) {
                framesRef.current[index] = blob;
                if (index === 0) {
                  readyRef.current = true;
                  setFrame0Ready(true);
                }
                if (Math.abs(wantRef.current - index) <= 1) {
                  drawWant(wantRef.current);
                }
              }
              resolve(blob);
            },
            "image/jpeg",
            quality
          );
        } catch {
          resolve(null);
        }
      });

    const runImageSynthesisFallback = async () => {
      const loadImg = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      const [startImg, endImg] = await Promise.all([
        loadImg(fallbackStartSrc),
        loadImg(fallbackEndSrc),
      ]);
      if (cancelled || !startImg || !capCtx) return;

      const nf = 121;
      nfRef.current = nf;
      framesRef.current = new Array(nf);

      const renderFrame = (i) =>
        new Promise((resolve) => {
          const t = i / (nf - 1);
          const zoomA = 1 + 0.42 * Math.pow(t, 1.45);
          const alphaB = Math.min(1, Math.max(0, (t - 0.35) / 0.45));

          capCtx.clearRect(0, 0, CAP_W, CAP_H);
          capCtx.save();
          capCtx.globalAlpha = 1;
          const swA = CAP_W / zoomA;
          const shA = CAP_H / zoomA;
          const sxA = (CAP_W - swA) * 0.5;
          const syA = (CAP_H - shA) * 0.5 + t * 24;
          capCtx.drawImage(
            startImg,
            (sxA / CAP_W) * startImg.naturalWidth,
            (syA / CAP_H) * startImg.naturalHeight,
            (swA / CAP_W) * startImg.naturalWidth,
            (shA / CAP_H) * startImg.naturalHeight,
            0,
            0,
            CAP_W,
            CAP_H
          );
          if (endImg && alphaB > 0) {
            capCtx.globalAlpha = alphaB;
            const zoomB = 1.18 - 0.18 * Math.pow(t, 0.85);
            const swB = endImg.naturalWidth / zoomB;
            const shB = endImg.naturalHeight / zoomB;
            capCtx.drawImage(
              endImg,
              (endImg.naturalWidth - swB) * 0.5,
              (endImg.naturalHeight - shB) * 0.5,
              swB,
              shB,
              0,
              0,
              CAP_W,
              CAP_H
            );
          }
          capCtx.restore();

          capCanvas.toBlob(
            (blob) => {
              if (!cancelled && blob) {
                framesRef.current[i] = blob;
                if (i === 0) {
                  readyRef.current = true;
                  setFrame0Ready(true);
                  drawWant(wantRef.current);
                }
              }
              resolve();
            },
            "image/jpeg",
            i === 0 ? 0.9 : 0.86
          );
        });

      await renderFrame(0);
      for (let i = 1; i < nf; i += 1) {
        if (cancelled) break;
        await renderFrame(i);
      }
      drawWant(wantRef.current);
    };

    const waitForSeek = (targetTime) =>
      new Promise((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked, { once: true });
        video.currentTime = targetTime;
      });

    const startCaching = async () => {
      if (cancelled) return;
      const duration =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : 5.04;
      const nf = Math.max(2, Math.round(duration * FPS));
      nfRef.current = nf;
      framesRef.current = new Array(nf);

      // Capture frame 0 first at quality 0.9 for seamless still-to-video handoff
      await waitForSeek(0);
      if (cancelled) return;
      await captureCurrentFrame(0, 0.9);
      drawWant(wantRef.current);

      if (typeof video.requestVideoFrameCallback === "function") {
        let rvfcId = null;
        const onVideoFrame = (_now, metadata) => {
          if (cancelled) return;
          const idx = Math.min(nf - 1, Math.round(metadata.mediaTime * FPS));
          if (!framesRef.current[idx]) {
            captureCurrentFrame(idx, 0.86);
          }
          if (!video.ended && !cancelled) {
            rvfcId = video.requestVideoFrameCallback(onVideoFrame);
          }
        };

        const onEnded = async () => {
          if (cancelled) return;
          // Fill any skipped frames sequentially
          for (let i = 0; i < nf; i += 1) {
            if (cancelled) break;
            if (!framesRef.current[i]) {
              await waitForSeek(Math.min(i / FPS, duration - 0.01));
              await captureCurrentFrame(i, 0.86);
            }
          }
        };

        video.addEventListener("ended", onEnded, { once: true });
        rvfcId = video.requestVideoFrameCallback(onVideoFrame);

        try {
          video.currentTime = 0;
          video.playbackRate = 1;
          await video.play();
        } catch {
          if (rvfcId !== null && typeof video.cancelVideoFrameCallback === "function") {
            video.cancelVideoFrameCallback(rvfcId);
          }
          for (let i = 1; i < nf; i += 1) {
            if (cancelled) break;
            await waitForSeek(Math.min(i / FPS, duration - 0.01));
            await captureCurrentFrame(i, 0.86);
          }
        }
      } else {
        // Sequential seek fallback
        for (let i = 1; i < nf; i += 1) {
          if (cancelled) break;
          await waitForSeek(Math.min(i / FPS, duration - 0.01));
          await captureCurrentFrame(i, 0.86);
        }
      }
    };

    const onLoadedData = () => {
      startCaching();
    };

    const onError = () => {
      runImageSynthesisFallback();
    };

    video.addEventListener("loadeddata", onLoadedData, { once: true });
    video.addEventListener("error", onError, { once: true });

    if (video.readyState >= 2) {
      startCaching();
    } else if (video.src !== videoSrc) {
      video.src = videoSrc;
      video.load();
    }

    if (typeof window !== "undefined") {
      window.__hero = {
        ready: () => readyRef.current,
        settled: () => !busyRef.current && drawnRef.current === wantRef.current,
        cachedCount: () => framesRef.current.filter(Boolean).length,
        totalFrames: () => nfRef.current,
      };
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      try {
        video.pause();
      } catch {}
    };
  }, [drawWant, fallbackEndSrc, fallbackStartSrc, videoRef, videoSrc]);

  return {
    nfRef,
    frame0Ready,
    drawWant,
  };
}
