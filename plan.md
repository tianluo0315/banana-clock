## 产品概述

香蕉时钟是一款基于番茄工作法的Windows桌面应用，帮助用户通过任务绑定和专注计时器管理专注时间，提供数据统计和分析功能。

## 核心功能

### 专注计时器模块

- 大型数字倒计时器显示（MM:SS格式），默认25分钟
- 开始、暂停、重置控制按钮，重置需二次确认
- 今日已完成专注次数统计
- 自然结束时播放提示音
- 计时器必须绑定任务才能启动

### 任务管理模块

- 任务卡片列表，按状态分组（等待中、进行中、已完成）
- 任务属性：名称、标签（工作/学习/运动/休闲）、目标时长、累计时长、状态
- 任务操作：创建、开始、结束（需二次确认）、删除、重新激活
- 数据关联：任务进行期间计时器时间累加到任务累计时长

### 数据统计模块

- 历史记录列表：按时间倒序展示已完成任务
- 趋势分析：近7天每日专注次数和总时长折线图
- 占比分析：任务标签累计时长占比饼图

### 系统功能

- 窗口置顶和最小化到系统托盘
- SQLite本地数据库存储所有数据
- 自定义音效提醒
- 响应式三栏式布局

## 技术栈选择

- **前端框架**: React 18 + TypeScript
- **桌面框架**: Electron 28
- **样式方案**: Tailwind CSS + shadcn/ui组件库
- **图表库**: Recharts (TypeScript友好)
- **数据库**: SQLite3 + better-sqlite3 (原生绑定)
- **状态管理**: React Context + useReducer
- **打包工具**: electron-builder (Windows安装包)
- **构建工具**: Vite (快速开发和构建)

## 实现方案

### 系统架构

采用典型Electron主进程-渲染进程架构：

- **主进程**: 负责窗口管理、系统托盘、数据库连接、文件系统访问
- **渲染进程**: React应用，处理UI和业务逻辑
- **预加载脚本**: 安全地暴露主进程API给渲染进程

### 数据流设计

1. 用户操作触发React状态更新
2. 状态变更通过IPC发送到主进程
3. 主进程更新SQLite数据库
4. 数据库变更通过IPC返回渲染进程
5. React组件重新渲染

### 数据库设计

SQLite数据库包含以下表：

- `tasks`: 任务表（id, name, tag, target_minutes, accumulated_minutes, status, created_at, updated_at）
- `focus_sessions`: 专注会话表（id, task_id, start_time, end_time, duration_minutes, is_valid, created_at）
- `daily_stats`: 每日统计表（id, date, focus_count, total_minutes）
- `app_settings`: 应用设置表（id, key, value）

### 性能优化

- 使用SQLite索引优化查询性能
- 防抖处理频繁的UI更新
- 使用Web Workers处理复杂图表计算
- 懒加载统计模块

### 错误处理策略

- 全局错误边界处理React渲染错误
- IPC通信错误重试机制
- 数据库操作事务回滚
- 优雅降级：网络或数据库异常时提供离线功能

## 实现细节

### 关键实现要点

1. **系统托盘**: 使用`electron.Tray`创建托盘图标，支持右键菜单
2. **窗口置顶**: 使用`win.setAlwaysOnTop(true)`实现
3. **音效播放**: 使用HTML5 Audio API，音效文件打包到应用资源
4. **二次确认**: 统一使用自定义模态框组件，确保一致性
5. **数据同步**: 使用SQLite触发器自动更新任务累计时长

### 日志记录

- 开发环境：console.log输出详细日志
- 生产环境：只记录错误和关键操作
- 日志文件存储在用户数据目录

### 安全考虑

- 使用Electron安全最佳实践（上下文隔离、禁用Node.js集成）
- 输入验证：防止SQL注入和XSS攻击
- 数据加密：敏感设置使用加密存储

## 目录结构

```
banana-clock/
├── electron/                    # 主进程代码
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 预加载脚本
│   ├── ipc/                    # IPC通信处理
│   │   ├── task-handler.ts     # 任务相关IPC
│   │   ├── timer-handler.ts    # 计时器相关IPC
│   │   └── stats-handler.ts    # 统计相关IPC
│   ├── database/               # 数据库层
│   │   ├── db-manager.ts       # 数据库连接管理
│   │   ├── migrations/         # 数据库迁移脚本
│   │   ├── models/             # 数据模型定义
│   │   └── queries/            # SQL查询封装
│   └── system/                 # 系统功能
│       ├── tray-manager.ts     # 系统托盘管理
│       ├── window-manager.ts   # 窗口管理
│       └── audio-manager.ts    # 音效管理
├── src/                        # 渲染进程代码
│   ├── main.tsx               # React应用入口
│   ├── App.tsx                # 主应用组件
│   ├── components/            # 可复用组件
│   │   ├── ui/                # 基础UI组件
│   │   │   ├── button.tsx     # 按钮组件
│   │   │   ├── card.tsx       # 卡片组件
│   │   │   ├── modal.tsx      # 模态框组件
│   │   │   └── ...            # 其他组件
│   │   ├── timer/             # 计时器组件
│   │   │   ├── timer-display.tsx      # 计时器显示
│   │   │   ├── timer-controls.tsx     # 控制按钮
│   │   │   └── timer-hook.ts          # 计时器逻辑hook
│   │   ├── tasks/             # 任务相关组件
│   │   │   ├── task-card.tsx          # 任务卡片
│   │   │   ├── task-form.tsx          # 任务表单
│   │   │   ├── task-list.tsx          # 任务列表
│   │   │   └── task-hook.ts           # 任务逻辑hook
│   │   └── stats/             # 统计组件
│   │       ├── trend-chart.tsx        # 趋势图表
│   │       ├── pie-chart.tsx          # 饼图组件
│   │       └── history-list.tsx       # 历史记录
│   ├── contexts/              # React Context
│   │   ├── app-context.tsx            # 应用全局状态
│   │   ├── timer-context.tsx          # 计时器状态
│   │   └── task-context.tsx           # 任务状态
│   ├── hooks/                 # 自定义Hooks
│   │   ├── use-database.ts            # 数据库操作hook
│   │   ├── use-ipc.ts                 # IPC通信hook
│   │   └── use-interval.ts            # 定时器hook
│   ├── types/                 # TypeScript类型定义
│   │   ├── task.ts                    # 任务类型
│   │   ├── timer.ts                   # 计时器类型
│   │   ├── stats.ts                   # 统计类型
│   │   └── database.ts                # 数据库类型
│   ├── utils/                 # 工具函数
│   │   ├── format.ts                  # 格式化函数
│   │   ├── validation.ts              # 验证函数
│   │   └── constants.ts               # 常量定义
│   └── assets/               # 静态资源
│       ├── audio/            # 音效文件
│       └── icons/            # 图标文件
├── public/                   # 公共静态文件
├── tests/                    # 测试文件
│   ├── unit/                # 单元测试
│   └── e2e/                 # 端到端测试
├── scripts/                  # 构建脚本
├── package.json              # 项目配置
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
├── electron-builder.json     # Electron打包配置
└── README.md                 # 项目文档
```

## 关键代码结构

### 类型定义

```typescript
// src/types/task.ts
export type TaskTag = 'work' | 'study' | 'sport' | 'leisure';
export type TaskStatus = 'waiting' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  name: string;
  tag: TaskTag;
  targetMinutes: number;
  accumulatedMinutes: number;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/timer.ts
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  currentTaskId: string | null;
  currentSessionId: string | null;
}

// src/types/database.ts
export interface FocusSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
  isValid: boolean;
  createdAt: Date;
}
```

### IPC通信接口

```typescript
// electron/ipc/channels.ts
export const IPC_CHANNELS = {
  TASK: {
    CREATE: 'task:create',
    UPDATE: 'task:update',
    DELETE: 'task:delete',
    GET_ALL: 'task:get-all',
  },
  TIMER: {
    START: 'timer:start',
    PAUSE: 'timer:pause',
    RESET: 'timer:reset',
    GET_STATE: 'timer:get-state',
  },
  STATS: {
    GET_DAILY: 'stats:get-daily',
    GET_BY_TAG: 'stats:get-by-tag',
  },
} as const;
```

## 设计风格

采用现代简约设计风格，以香蕉主题色（浅黄色）为主色调，搭配清新的配色方案。整体布局采用三栏式结构，确保功能分区清晰，操作直观。

## 页面规划

### 1. 主界面（三栏布局）

**左侧栏 - 专注计时器核心区**

- 大型数字计时器显示（MM:SS格式），使用醒目字体
- 当前绑定任务显示区域，显示任务名称和标签
- 控制按钮组：开始/暂停、重置（带二次确认）
- 今日专注统计：显示"今日已完成 N 次专注"

**右侧上部 - 任务管理区**

- 任务创建表单：折叠式设计，点击"新增任务"展开
- 任务列表：按状态分组（进行中、等待开始、已完成）
- 任务卡片：包含任务信息、进度条、状态标签、操作按钮
- 搜索和筛选功能

**右侧下部 - 数据统计区**

- 趋势分析图表：近7天专注次数和时长折线图
- 占比分析图表：任务标签时长占比饼图
- 历史记录列表：按时间倒序排列

### 2. 模态框设计

- **任务选择模态框**：计时器启动时弹出，显示可用的任务列表
- **二次确认模态框**：统一设计，包含标题、描述、确认和取消按钮
- **任务表单模态框**：用于创建和编辑任务

## 区块设计详情

### 计时器显示区块

- 使用大型数字字体（72px）显示剩余时间
- 背景使用浅黄色渐变，营造温馨氛围
- 时间下方显示当前绑定任务名称和标签颜色
- 控制按钮采用大尺寸圆角设计，提供明确视觉反馈

### 任务卡片区块

- 卡片采用白色背景，轻微阴影增加层次感
- 左侧彩色竖条标识任务标签（蓝/绿/橙/紫）
- 进度条直观显示累计时长/目标时长比例
- 状态标签使用不同颜色区分（等待中：灰色，进行中：绿色，已完成：蓝色）
- 操作按钮根据状态动态显示，提供悬停效果

### 图表显示区块

- 使用Recharts实现响应式图表
- 折线图使用柔和配色，数据点清晰可辨
- 饼图使用标签对应颜色，显示百分比标签
- 图表容器使用卡片设计，包含标题和说明

### 导航与系统控制

- 顶部导航栏：应用名称、窗口置顶开关、设置按钮
- 系统托盘菜单：恢复窗口、暂停/继续、退出应用
- 响应式布局：适配不同窗口尺寸，确保在小窗口下仍可操作

## 代理扩展

### SubAgent

- **code-explorer**
- 目的：在开发过程中探索代码库结构，确保代码组织符合最佳实践
- 预期成果：验证项目结构，识别潜在的重构机会，确保代码质量

### Skill (可选)

- **skill-creator**
- 目的：如果需要创建自定义开发工具或工作流，可用于扩展开发能力
- 预期成果：创建项目特定的开发辅助工具，提高开发效率