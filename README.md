# Sound Cues — The Merchant of Venice (Group 6)

Bảng soundboard chạy hoàn toàn trên trình duyệt, tự cập nhật danh sách cue
mỗi khi bạn thêm file âm thanh vào thư mục `sound/` và push lên GitHub.

## Cách hoạt động

1. Bạn bỏ file mp3/wav/ogg vào `sound/<Ten Canh>/...` rồi push.
2. GitHub Action (`.github/workflows/update-soundboard.yml`) tự chạy
   `scripts/generate-manifest.js`, quét thư mục `sound/` và ghi lại
   `sounds.json`, rồi tự commit file đó vào repo.
3. Trang `index.html` chỉ đọc `sounds.json` để vẽ bảng cue — không có tên
   file nào bị "gắn cứng" trong HTML, nên không cần sửa code khi thêm cue mới.

## Cài đặt ban đầu (một lần)

1. Tạo repo GitHub, push toàn bộ thư mục này lên nhánh `main`.
2. Vào **Settings → Actions → General → Workflow permissions**, chọn
   **Read and write permissions** (để Action có quyền tự commit
   `sounds.json`).
3. (Tuỳ chọn, để xem bảng online) Vào **Settings → Pages**, chọn nhánh
   `main`, thư mục `/ (root)`.
4. Thêm vài file âm thanh vào `sound/Scene 1.1/`, push — kiểm tra tab
   **Actions** thấy workflow chạy xong, `sounds.json` được cập nhật, rồi mở
   trang lên xem cue đã hiện chưa.

## Cấu trúc thư mục

```
index.html                          bảng soundboard
sounds.json                         danh sách cue (tự sinh, đừng sửa tay)
sound/                              bỏ file âm thanh vào đây
  README.md                         quy ước đặt tên/thư mục
scripts/generate-manifest.js        script quét sound/ -> sounds.json
.github/workflows/update-soundboard.yml   Action tự chạy script trên mỗi push
```

## Dùng thử ở máy, không cần đợi Action

```
node scripts/generate-manifest.js   # sinh sounds.json từ thư mục sound/ hiện có
python3 -m http.server 8000         # bắt buộc phải qua server, mở file:// sẽ lỗi fetch
```

rồi mở `http://localhost:8000`.

## Điều khiển trên bảng

- Bấm 1 ô cue để phát; bấm lại để dừng riêng cue đó.
- **■ STOP ALL** (góc trên phải) hoặc phím **Esc** để dừng mọi cue đang chạy.
- Phím **/** để nhảy vào ô tìm kiếm.
- **↻ reload cues** để tải lại `sounds.json` mà không cần refresh cả trang
  (hữu ích nếu Action vừa cập nhật xong trong lúc bạn đang mở bảng).
