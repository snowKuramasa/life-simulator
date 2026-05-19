import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import startImage from "@/assets/90.png";
import { Image } from "@/components/commons/uis/Image";

describe("Image", () => {
  it("renders an image with src and alt text", () => {
    render(<Image src={startImage} alt="食卓で過ごす人と犬のイラスト" />);

    const image = screen.getByRole("img", { name: "食卓で過ごす人と犬のイラスト" });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", startImage);
  });

  it("sets fixed width and height as CSS variables", () => {
    render(<Image src={startImage} alt="固定サイズ画像" width={250} height={250} />);

    const image = screen.getByRole("img", { name: "固定サイズ画像" });

    expect(image).toHaveStyle({
      "--image-width": "250px",
      "--image-width-md": "250px",
      "--image-height": "250px",
      "--image-height-md": "250px",
    });
  });

  it("sets responsive width and height as CSS variables", () => {
    render(
      <Image
        src={startImage}
        alt="レスポンシブ画像"
        width={{ base: 250, md: 410 }}
        height={{ base: 250, md: 410 }}
      />,
    );

    const image = screen.getByRole("img", { name: "レスポンシブ画像" });

    expect(image).toHaveStyle({
      "--image-width": "250px",
      "--image-width-md": "410px",
      "--image-height": "250px",
      "--image-height-md": "410px",
    });
  });
});
