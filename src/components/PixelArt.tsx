import { useEffect, useRef } from "react";

export function PixelArt(props: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img !== null) {
      //@ts-ignore
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
          //@ts-ignore
          const context = canvas.getContext("2d");
          context.drawImage(imgRef.current, 0, 0);
        }
      };
    }
  }, [canvasRef, imgRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
      ></canvas>
      <div style={{ display: "none" }}>
        <img
          ref={imgRef}
          src={props.src}
          width={props.width}
          height={props.height}
          alt={props.alt}
        />
      </div>
    </div>
  );
}
