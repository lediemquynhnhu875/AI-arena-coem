"""Demo thu UI, chi dung thu vien chuan:   python serve.py   roi mo http://localhost:8000
  /api/options  -> manifest (cac nhom nut) + preset
  /api/render   -> SVG theo query (gender, age, build, hair, accessory, view ...)
Trang web doi mau da / toc bang bien CSS, khong goi lai server."""
import json
import sys
from functools import lru_cache
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from croquis import render
from croquis.export_manifest import manifest
from croquis.presets import list_presets

WEB = Path(__file__).parent / "web"
SHAPE_KEYS = ("gender", "age", "build", "hair", "accessory", "view")


@lru_cache(maxsize=512)
def _svg(key):
    cfg = dict(key)
    cfg["skin"] = "banh_mat"          # mau that do CSS (--skin/--hair) quyet dinh o phia trinh duyet
    return render(cfg, css_vars=True)


class Handler(BaseHTTPRequestHandler):
    def _send(self, body, ctype, code=200):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        u = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(u.query).items()}
        try:
            if u.path == "/api/options":
                return self._send(json.dumps({"groups": manifest(), "presets": list_presets()},
                                             ensure_ascii=False), "application/json; charset=utf-8")
            if u.path == "/api/render":
                key = tuple(sorted((k, q[k]) for k in SHAPE_KEYS if k in q))
                return self._send(_svg(key), "image/svg+xml; charset=utf-8")
            if u.path in ("/", "/index.html"):
                return self._send((WEB / "index.html").read_text(encoding="utf-8"), "text/html; charset=utf-8")
        except (KeyError, ValueError) as e:
            return self._send(str(e), "text/plain; charset=utf-8", 400)
        self._send("not found", "text/plain", 404)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"http://localhost:{port}")
    ThreadingHTTPServer(("", port), Handler).serve_forever()
