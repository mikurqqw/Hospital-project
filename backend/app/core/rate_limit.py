from collections import defaultdict, deque
from time import monotonic

from fastapi import Request
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import JSONResponse, Response

# Single-instance demo limiter. Use a shared store before scaling beyond one worker.
windows: dict[tuple[str, str], deque[float]] = defaultdict(deque)


async def rate_limit(request: Request, call_next: RequestResponseEndpoint) -> Response:
    path = request.url.path
    if request.method == "POST" and path.startswith("/api/"):
        try:
            size = int(request.headers.get("content-length", "0"))
        except ValueError:
            return JSONResponse({"detail": "Invalid Content-Length"}, status_code=400)
        if size > 6 * 1024 * 1024:
            return JSONResponse(
                {"detail": "Maximum request size is 6 MB"}, status_code=413
            )
        group = "auth" if path.startswith("/api/auth/") else "api"
        address = request.client.host if request.client else "unknown"
        now = monotonic()
        for key in list(windows):
            if not windows[key] or windows[key][-1] < now - 60:
                del windows[key]
        bucket = windows[(address, group)]
        while bucket and bucket[0] < now - 60:
            bucket.popleft()
        if len(bucket) >= (15 if group == "auth" else 12):
            return JSONResponse(
                {"detail": "Слишком много запросов. Подождите минуту."},
                status_code=429,
                headers={"Retry-After": "60"},
            )
        bucket.append(now)
    return await call_next(request)
