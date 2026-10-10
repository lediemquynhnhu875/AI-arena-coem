/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function openGiuChuanVanHoa(costumeName?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("vpr:open-giu-chuan", {
        detail: { costumeName },
      })
    );
  }
}
