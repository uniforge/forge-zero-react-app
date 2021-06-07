import { useEffect, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { LABELS } from "../constants";
import { PixelArt } from "./PixelArt";

export function BareBeachCard(props: {
  cover: string;
  insert: string;
  isFlipped: boolean;
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(props.isFlipped);

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

  function handleClick(e: any) {
    e.preventDefault();
    setIsFlipped((isFlipped) => !isFlipped);
  }

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      <PixelArt
        src={props.cover}
        alt={LABELS.TOKEN_NAME + " example cover art"}
        width={48}
        height={48}
        className={"token-card"}
        onClick={handleClick}
      />
      <PixelArt
        src={props.insert}
        alt={LABELS.TOKEN_NAME + " example beach scene"}
        width={96}
        height={96}
        className={"token-card"}
        onClick={handleClick}
      />
    </ReactCardFlip>
  );
}
