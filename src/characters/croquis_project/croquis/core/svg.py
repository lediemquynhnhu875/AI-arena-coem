"""Ham dung SVG co ban: lat doi xung, bao nhom, tai lieu."""


def both(s):
    """Ve phan tu va ban lat guong cua no (qua truc x=0)."""
    return s + f'<g transform="scale(-1,1)">{s}</g>'


def group(s, dx=0, dy=0):
    return f'<g transform="translate({dx},{dy})">{s}</g>'


def document(content, w, h, bg="#fffdfd"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="{bg}"/>'
            f'{content}</svg>')
