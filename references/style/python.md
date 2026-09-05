# Python Coding Standards (Based on Google Python Style Guide)

Adapted and condensed from the Google Python Style Guide, not reproduced verbatim, and carrying rules the upstream guide does not: the Chinese-language requirement below governs comments, docstrings, and TODO descriptions. This file constrains Python code only; the index mapping each language to its style file lives in the project's always-loaded rules (`AGENTS.md`).

> **Team Rule on Language**: All docstrings, inline comments, block comments, and TODO descriptions **must be written in Chinese** to ensure clarity for the team. This document is kept in English for rule consistency.

## 1. Language Rules

### 1.1 Imports
- Import packages and modules only: `import os`, `from absl import flags`.
- Use full package paths; no relative imports.
- Group and sort: `__future__` → stdlib → third-party → local. Sort lexicographically.
- Exception: `typing` and `collections.abc` symbols may be imported directly.

### 1.2 Exceptions
- Use built-in exceptions (e.g., `ValueError`) for preconditions.
- Never use bare `except:` or `except Exception:` unless re-raising.
- Minimize code inside `try/except`; use `finally` for cleanup.

### 1.3 Mutable Global State
- Avoid mutable global state. Use module-level constants (`ALL_CAPS`) when needed.

### 1.4 Comprehensions & Generators
- Allowed for simple cases only. No multiple `for` clauses or nested filters.
- Use `Yields:` in generator docstrings.

### 1.5 Lambda
- OK for one-liners only. Prefer `operator` module functions (e.g., `operator.mul`).

### 1.6 Default Argument Values
- Never use mutable objects (e.g., `[]`, `{}`) as defaults.

### 1.7 Properties
- Use `@property` for trivial computed attributes only. No manual descriptors.

### 1.8 True/False Evaluations
- Use implicit boolean evaluation: `if foo:` not `if foo != []:`.
- Always use `is None` / `is not None` for `None` checks.

### 1.9 Decorators
- Use judiciously. Avoid `staticmethod`; limit `classmethod` to named constructors.

### 1.10 Threading
- Do not rely on atomicity of built-in types. Use `queue.Queue` or `threading` locks.

### 1.11 Power Features
- Avoid metaclasses, bytecode manipulation, dynamic inheritance, `__del__`, etc.

### 1.12 Type Annotations
- Strongly encouraged for public APIs. Use `pytype` for checking.
- Use `X | None` for nullable types; never implicit `a: str = None`.

## 2. Style Rules

### 2.1 Line Length & Indentation
- Maximum **80 characters**.
- Indent with **4 spaces**. No tabs.
- Use implicit line continuation via parentheses; never backslash `\`.

### 2.2 Parentheses
- Use sparingly. Do not wrap conditionals or returns unnecessarily.

### 2.3 Blank Lines
- Two blank lines between top-level definitions.
- One blank line between method definitions.

### 2.4 Whitespace
- No spaces inside `()`, `[]`, `{}`.
- No space before comma/colon/semicolon; one space after.
- No spaces around `=` in keyword arguments or defaults (except with type annotations: `def f(a: int = 0)`).

### 2.5 Shebang
- Use `#!/usr/bin/env python3` for executable entry points only.

### 2.6 Strings
- Prefer f-strings, `%`, or `format`. Do not build strings with `+` in loops.
- Use `"""` for multi-line strings and docstrings.
- For logging, use `%`-style placeholders (not f-strings).

### 2.7 Files & Resources
- Always use `with` for files, sockets, and similar resources.

### 2.8 TODO Comments
- Format: `# TODO(issue-link): 描述` (描述 in Chinese per team rule).

### 2.9 Statements
- One statement per line. `if foo: bar()` is OK only if it fits on one line and has no `else`.

### 2.10 Accessors
- Use getters/setters only when access involves nontrivial logic. Otherwise expose attributes directly or use `@property`.

## 3. Naming

| Type | Public | Internal |
|---|---|---|
| Package | `lower_with_under` | |
| Module | `lower_with_under` | `_lower_with_under` |
| Class | `CapWords` | `_CapWords` |
| Exception | `CapWords` | |
| Function / Method | `lower_with_under()` | `_lower_with_under()` |
| Constant | `CAPS_WITH_UNDER` | `_CAPS_WITH_UNDER` |
| Variable | `lower_with_under` | `_lower_with_under` |
| Parameter / Local | `lower_with_under` | |

- Avoid single-character names except for counters (`i`, `j`, `k`), exception `e`, file handle `f`, or type variables (`_T`, `_P`).
- No dashes in filenames; always use `.py`.

### 3.5 Mathematical Notation
For mathematically-heavy code, short names matching established notation in a reference paper or algorithm are permitted even if they violate normal naming rules.
- **Cite the source** of naming conventions in a comment or docstring, preferably with a hyperlink.
- **Public APIs must still use PEP8-compliant descriptive names**; map them to short symbols internally.
- Use `pylint: disable=invalid-name` to silence warnings. For a few variables, use endline comments; for more, apply at the beginning of a block.

## 4. Comments & Docstrings (Chinese Required)

> **All docstrings, inline comments, and block comments must be written in Chinese.**

### 4.1 Docstrings
- Use `"""` (triple double quotes).
- First line: one-line summary ending with `.`, `?`, or `!`.
- For functions, use sections:
  - `Args:` — parameter names, types, descriptions.
  - `Returns:` or `Yields:` — type and semantics.
  - `Raises:` — relevant exceptions.

Example:
```python
def fetch_data(keys: list[str]) -> dict[str, str]:
    """根据键列表获取数据.

    Args:
        keys: 字符串键列表.

    Returns:
        键到值的映射字典.

    Raises:
        ValueError: 如果键列表为空.
    """
```

### 4.2 Inline Comments
- Place at least 2 spaces after code, then `#`, then 1 space.
- Explain *why*, not *what*.

```python
# 使用加权字典搜索以提高查找效率.
if i & (i - 1) == 0:  # 当 i 为 0 或 2 的幂时成立.
```

## 5. Main Entry Point

- Executable files must define `main()` and guard execution:

```python
def main():
    ...

if __name__ == '__main__':
    main()
```

## 6. Function Length

- Prefer small, focused functions. Consider splitting if a function exceeds ~40 lines.

## 7. Type Annotation Rules

### 7.1 General
- Annotate public APIs. Use `Any` when a type is intentionally unconstrained.
- Break long signatures with one parameter per line; add trailing comma before return type.

### 7.2 Forward References
- Use `from __future__ import annotations` or string literals for forward references.

### 7.3 Default Values
- Use spaces around `=` only for arguments with both type annotation and default value: `def f(a: int = 0)`.

### 7.4 NoneType
- Use explicit `X | None`. Never write `a: str = None`.

### 7.5 Generics
- Prefer built-in generic types (`list[int]`, `dict[str, float]`) over `typing.List`, `typing.Dict`.
- Use abstract container types (`collections.abc.Sequence`) over concrete types (`list`) in parameter annotations.

### 7.6 Type Aliases
Declare aliases for complex types that appear frequently.
- Use **CapWords** naming. If module-private, prefix with `_`.
- Explicit `: TypeAlias` annotation requires **Python 3.10+**.

```python
from typing import TypeAlias
from collections.abc import Mapping

# 模块私有
_LossAndGradient: TypeAlias = tuple[tf.Tensor, tf.Tensor]

# 公共
ComplexTFMap: TypeAlias = Mapping[str, _LossAndGradient]
```

### 7.7 Type Variables
- Use `TypeVar` and `ParamSpec` with descriptive names.
- Private unconstrained variables: `_T`, `_P`.
- Constrained variables: descriptive names like `AddableType`.

---

*Be consistent. Match the style of surrounding code when editing existing files.*