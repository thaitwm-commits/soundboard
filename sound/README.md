# Thư mục `sound/`

Bỏ file âm thanh (.mp3, .wav, .ogg, .m4a, .aac, .flac) vào đây rồi push lên git.
`sounds.json` sẽ tự được sinh lại và bảng cue trên trang sẽ tự cập nhật —
không cần sửa file HTML.

## Cách tổ chức

Tạo một thư mục con cho mỗi cảnh, tên thư mục sẽ là tiêu đề nhóm cue trên
bảng:

```
sound/
  Scene 1.1/
    01-crowd-murmur.mp3
    02-gavel-bang.mp3
    03-applause.mp3
    04-reveal-sting.mp3
  Scene 1.2/
    01-footsteps-fade.mp3
    02-ring-chime.mp3
  Scene 2.1/
    01-belmont-theme.mp3
    02-hurried-footsteps.mp3
```

- Đánh số ở đầu tên file (`01-`, `02-`…) để cue hiện đúng thứ tự bạn muốn —
  số này sẽ không hiện trong tên hiển thị trên bảng.
- Dấu `-` hoặc `_` trong tên file sẽ tự chuyển thành khoảng trắng khi hiển thị
  (`ring-chime.mp3` → "Ring Chime").
- File thả thẳng vào `sound/` (không có thư mục con) sẽ được gom vào nhóm
  "General".

## Chạy thử ở máy (không cần đợi git push)

```
node scripts/generate-manifest.js
python3 -m http.server 8000
```

rồi mở `http://localhost:8000`.
