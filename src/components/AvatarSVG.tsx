/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AvatarSVG — Bridge chuyển tiếp tới src/characters/CharacterRenderer
 * Duy trì tính tương thích ngược cho toàn bộ các màn hình hiện hữu.
 */

import React from "react";
import CharacterRenderer, { CharacterRendererProps } from "../characters/CharacterRenderer";

export type AvatarSVGProps = CharacterRendererProps;

export default function AvatarSVG(props: CharacterRendererProps) {
  return <CharacterRenderer {...props} />;
}
