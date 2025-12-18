# D365 - Microsoft Dynamics 365 Kod Koleksiyonu

Bu repository, Microsoft Dynamics 365 için örnek kod koleksiyonunu içermektedir.

## İçerik / Content

### 📁 Proje Yapısı / Project Structure

```
D365/
├── src/
│   ├── Plugins/                 # D365 Plugin'leri
│   │   ├── SamplePlugin.cs     # Temel plugin örneği
│   │   └── AccountPlugin.cs    # Account entity plugin'i
│   ├── Workflows/              # Özel Workflow Activity'leri
│   │   ├── CustomWorkflowActivity.cs
│   │   └── SendEmailActivity.cs
│   └── WebResources/           # Web Kaynakları
│       ├── Scripts/            # JavaScript dosyaları
│       │   ├── FormScripts.js      # Form event handler'ları
│       │   └── RibbonCommands.js   # Ribbon komutları
│       ├── HTML/               # HTML dosyaları
│       │   └── CustomPage.html     # Özel HTML sayfası
│       └── CSS/                # CSS dosyaları
│           └── styles.css          # Stil dosyası
├── Solutions/                  # D365 Solution dosyaları
├── D365.csproj                # Visual Studio proje dosyası
├── packages.config            # NuGet paketleri
└── README.md
```

## 🚀 Özellikler / Features

### Plugins
- **SamplePlugin.cs**: Temel plugin yapısı ve kullanımı
- **AccountPlugin.cs**: Account entity için özel iş mantığı implementasyonu
  - Otomatik account numarası oluşturma
  - Account adını büyük harfe çevirme

### Workflow Activities
- **CustomWorkflowActivity.cs**: Özel workflow adımı örneği
- **SendEmailActivity.cs**: E-posta gönderme workflow activity'si

### Web Resources
- **FormScripts.js**: Form event handler'ları
  - OnLoad, OnSave, OnChange event'leri
  - Form validasyonu
  - Dinamik field yönetimi
- **RibbonCommands.js**: Ribbon button komutları
  - Özel aksiyonlar
  - Excel'e export
- **CustomPage.html**: Özel HTML web resource sayfası
- **styles.css**: Modern CSS stilleri

## 📋 Gereksinimler / Requirements

- Visual Studio 2019 veya üzeri
- .NET Framework 4.7.2
- Microsoft Dynamics 365 SDK
- NuGet Package Manager

## 🔧 Kurulum / Installation

1. Repository'yi klonlayın:
```bash
git clone https://github.com/furkan59/D365.git
```

2. Visual Studio'da D365.csproj dosyasını açın

3. NuGet paketlerini geri yükleyin:
```bash
nuget restore
```

4. Projeyi derleyin:
```bash
msbuild D365.csproj
```

## 📚 Kullanım / Usage

### Plugin Kaydetme / Registering Plugins

1. Plugin Registration Tool'u kullanarak assembly'yi kaydedin
2. Plugin adımlarını yapılandırın
3. Uygun entity ve mesajları seçin

### Workflow Activity Kullanımı

1. Assembly'yi D365 ortamına kaydedin
2. Workflow designer'da custom step olarak kullanın
3. Input/output parametrelerini yapılandırın

### Web Resources Yükleme

1. Web resource'ları D365 ortamına yükleyin
2. Form customization'da JavaScript dosyalarını referans edin
3. Event handler'ları yapılandırın

## 🔐 Güvenlik / Security

- Assembly signing etkinleştirilmiştir
- Tüm plugin'ler exception handling içerir
- Logging ve tracing implement edilmiştir

## 📖 Dökümanlar / Documentation

- [Microsoft Dynamics 365 SDK Documentation](https://docs.microsoft.com/en-us/dynamics365/)
- [Plugin Development](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/write-plugin)
- [Workflow Extensions](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/workflow/workflow-extensions)

## 🤝 Katkıda Bulunma / Contributing

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📝 Lisans / License

Bu proje açık kaynak kodlu bir örnektir.

## 📞 İletişim / Contact

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu kod örnekleri eğitim ve referans amaçlıdır. Production ortamında kullanmadan önce gerekli testleri yapınız.
