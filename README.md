> [!NOTE]
> This is an **unofficial fork** of [Latte Softworks' RDD](https://github.com/latte-soft/rdd), maintained independently by [**WhatExpsAre.Online**](https://whatexpsare.online) (WEAO). The original project is hosted at [**`rdd.latte.to`**](https://rdd.latte.to). Latte Softworks is not responsible for this fork, though anyone is free to fork or rehost RDD under the MIT license.

## WEAO RDD ("Roblox Deployment Downloader")

Locally download Roblox deployments (Windows/Mac) directly from your browser!

Hosted @ [rdd.whatexpsare.online](https://rdd.whatexpsare.online) , [rdd.weao.gg](https://rdd.weao.gg) , [rdd.weao.xyz](https://rdd.weao.xyz)

Questions or issues? [Join our Discord](https://discord.gg/weaoxyz)

### What is this?

RDD assembles plain resources directly from Roblox's [`setup`](https://setup.rbxcdn.com) CDN into a zip you can extract and run. We do not host any files ourselves other than the optional WEAO weblauncher, which can be used to launch downloaded portable instances from Roblox.com. 

This fork builds on [Latte Softworks' RDD](https://github.com/latte-soft/rdd) with WEAO-specific additions and UI improvements.

### Usage

```txt
[*] USAGE: https://rdd.weao.xyz/?channel=<CHANNEL_NAME>&binaryType=<BINARY_TYPE>&version=<VERSION_HASH>

    Binary Types:
    * WindowsPlayer
    * WindowsStudio64
    * MacPlayer
    * MacStudio

    Extra Notes:
    * If `channel` isn't provided, it defaults to "LIVE" (production channel)
    * Provide `binaryType` alone to fetch the latest deployment on a channel, or
      BOTH `binaryType` and `version` for a specific build
    * `includeLauncher=true` bundles weblauncher.exe (Windows Player/Studio only)

    You can also use `blobDir` to specify where RDD should fetch deployment files
    from. This is only useful for non-default relative paths, such as "/mac/arm64"
    on certain channels.

    Blob Directories (Examples):
    * "/" (Default for WindowsPlayer/WindowsStudio64)
    * "/mac/" (Default for MacPlayer/MacStudio)
    * "/mac/arm64/"
    ..
```

### Credits

* [RDD](https://github.com/latte-soft/rdd) by [Latte Softworks](https://latte.to)
* [JSZip](https://github.com/Stuk/jszip) — zip extraction and generation
* [Latte Softworks channel-tracker](https://github.com/latte-soft/channel-tracker)

## License

See [LICENSE](LICENSE).

Based on Latte Softworks' RDD (MIT). This fork is also distributed under the MIT License.
