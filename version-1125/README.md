# 电视剧热播榜单-热门剧集片库-全集高清在线播放

本静态网站由上传素材生成，包含：

- 首页：index.html
- 分类总览页：categories.html
- 独立分类页：10 个
- 热播榜页：ranking.html
- 搜索筛选页：search.html
- 影片详情页：2000 个
- HTML 站点地图：sitemap.html
- XML Sitemap：sitemap.xml
- 影片数据：data/movies.json
- 本地 HLS 试看源：media/preview.m3u8

建议使用本地服务器访问，例如：

```bash
python3 -m http.server 8080
```

然后在浏览器打开 `http://localhost:8080/`。

说明：上传的影片 TXT 未包含真实 m3u8 地址，因此详情页播放器统一绑定到本地 HLS 试看源，用于保证播放按钮、HLS 初始化与 video 播放流程可用。后续替换真实播放源时，可把详情页中的 `data-source="../media/preview.m3u8"` 改为对应影片 m3u8 地址。
