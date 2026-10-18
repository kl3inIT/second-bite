# Go skills — nguồn

- samber/cc-skills-golang @ 8e899e2 (2026-10-01), MIT: golang-* (21 skill)
- cxuu/golang-skills @ 91f0c2e (2026-06-19), Apache-2.0: go-code-review

Bỏ qua có chủ ý: golang-samber-*, dependency-injection (kéo samber/do), cli/cobra/viper, grpc, graphql, wire/fx/dig, swagger (swaggo, dự án dùng huma), benchmark, refactoring, documentation, stay-updated, gopls, how-to.
Cập nhật: clone lại repo nguồn và chép đè các thư mục trên.

# Figma skills — nguồn

- awdr74100/figwright, chép từ BeyondPilot `3825fc73` (2026-10-01), MIT: figma-build, figma-codegen. Dùng với MCP `figwright` trong `.mcp.json` (`@figwright/mcp@0.6.0`) và plugin Figwright trong Figma desktop, cùng phiên bản. Quy tắc dùng cho Second Bite: [docs/guidelines/figma.md](../../docs/guidelines/figma.md).

# Web skills — nguồn

- shadcn-ui/ui, chép từ BeyondPilot `5f796557` (2026-10-01), MIT: shadcn. Dùng cho `web/` (registry shadcn, `components.json`).

# Flutter và Dart skills — nguồn

- flutter/agent-plugins @ b60d073 (2026-10-16), BSD-3-Clause, do đội Flutter duy trì; các skill `dart-*` trùng với dart-lang/skills: flutter-add-integration-test, flutter-add-widget-preview, flutter-setup-localization (chốt phần 5), flutter-add-widget-test, flutter-apply-architecture-best-practices, flutter-build-responsive-layout, flutter-fix-layout-issues, dart-add-unit-test, dart-collect-coverage, dart-fix-runtime-errors, dart-resolve-package-conflicts, dart-run-static-analysis, dart-use-pattern-matching, dart-use-primary-constructors, dart-write-documentation.

- VeryGoodOpenSource/vgv-ai-flutter-plugin @ 75b2512 (2026-10-13), MIT, Very Good Ventures: material-theming, ui-package, accessibility, static-security, testing, navigation (go_router với go_router_builder, chốt phần 3), internationalization (gen-l10n, chốt phần 5). Chỉ chép skill, không cài plugin (hook và agent của nó phụ thuộc Very Good CLI).

Mỗi chủ đề lấy một nguồn (quyết định ngày 18/10/2026, SEC-12): kiến trúc theo skill chính thức; giao diện, trợ năng, bảo mật và mock/golden theo VGV.
Không chép flutter-use-http-package và flutter-implement-json-serialization: client và model được sinh từ api/openapi.yaml bằng swagger_parser (chốt phần 4).
Không chép vì trùng nguồn đã chọn: flutter-setup-declarative-routing, dart-generate-test-mocks (mockito; dùng mocktail của VGV testing), dart-migrate-to-checks-package, bloc và layered-architecture của VGV.
Bỏ qua của VGV: create-project, green-gate (đòi 100% độ phủ), license-compliance, dart-flutter-sdk-upgrade, very-good-analysis-upgrade, agent flutter-reviewer, các hook.
Bỏ qua có chủ ý: dart-build-cli-app, dart-setup-ffi-assets, dart-use-ffigen, dart-use-doc-examples, dart-use-path-package.
Khi skill nói khác quyết định của repo, repo thắng:
- flutter-apply-architecture-best-practices viết ViewModel bằng `ChangeNotifier`: dùng Notifier của Riverpod 3 (`@riverpod`) thay vào. Riverpod không có skill chính thức và repo chỉ vendor skill của đội Flutter và Very Good Ventures, nên code Riverpod theo tài liệu chính thức riverpod.dev (tra qua Context7).
- material-theming đòi giao diện tối từ đầu: chưa làm, vì DESIGN.md chưa có giao diện tối. Màu không viết tay trong `AppColors`: token sinh từ frontmatter của DESIGN.md.
- internationalization: câu báo lỗi lấy từ `detail` của Go theo `Accept-Language` (SEC-28), không dịch mã lỗi trong file ARB.
- ui-package và testing gọi Very Good CLI (`very_good create app_ui_package`, `mcp__very-good-cli__*`): không bắt buộc; dùng `flutter test` và cấu trúc `mobile/` do SEC-12 phần 7 chốt.
Cập nhật: clone lại repo nguồn và chép đè các thư mục trên.
