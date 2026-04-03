# 인코딩 가드

이 저장소는 한글 텍스트가 많아서, 한 번 ANSI/CP949 또는 잘못된 자동 인코딩으로 저장되면 `index.html` 같은 대형 파일이 쉽게 깨진다.

## 기본 규칙

- 모든 소스 파일은 UTF-8로 저장한다.
- 줄바꿈은 LF로 통일한다.
- 인코딩 자동 추측은 끈다.
- PowerShell로 파일을 다시 쓸 때는 반드시 UTF-8을 명시한다.

## 저장소 가드

- [`.editorconfig`](C:\Users\sy.lee\Desktop\WORK\03. Study\RING-DYNASTY\.editorconfig): 기본 저장 규칙
- [`.gitattributes`](C:\Users\sy.lee\Desktop\WORK\03. Study\RING-DYNASTY\.gitattributes): 텍스트 파일 개행 규칙
- [`.vscode/settings.json`](C:\Users\sy.lee\Desktop\WORK\03. Study\RING-DYNASTY\.vscode\settings.json): VS Code UTF-8 강제
- [`scripts/check_source_integrity.ps1`](C:\Users\sy.lee\Desktop\WORK\03. Study\RING-DYNASTY\scripts\check_source_integrity.ps1): 깨진 문자/따옴표/백틱 검사

## 권장 작업 순서

1. 편집 전에 에디터 인코딩이 UTF-8인지 확인한다.
2. 대량 수정 전 `scripts/check_source_integrity.ps1`를 실행한다.
3. 수정 후 다시 검사한다.
4. `node --check` 또는 런타임 검증을 같이 돌린다.

## PowerShell 주의

다음처럼 UTF-8을 명시하지 않고 파일을 재저장하면 한글이 깨질 수 있다.

```powershell
Set-Content somefile.txt $content
```

가능하면 아래처럼 인코딩을 명시한다.

```powershell
Set-Content -Path somefile.txt -Value $content -Encoding UTF8
```

