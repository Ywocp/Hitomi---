// ==UserScript==
// @name         Brazen 增强搜索基础类
// @namespace    brazenvoid
// @version      6.3.1
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  搜索增强脚本基础类
// ==/UserScript==

// 保留原有图标
const ICON_RECYCLE = '&#x267B'

// 配置键名保持不变（不翻译）
const CONFIG_PAGINATOR_LIMIT = 'Pagination Limit'
const CONFIG_PAGINATOR_THRESHOLD = 'Pagination Threshold'
const FILTER_DURATION_RANGE = 'Duration'
const FILTER_PERCENTAGE_RATING_RANGE = 'Rating'
const FILTER_SUBSCRIBED_VIDEOS = 'Hide Subscribed Videos'
const FILTER_TAG_BLACKLIST = 'Tag Blacklist'
const FILTER_TEXT_BLACKLIST = 'Blacklist'
const FILTER_TEXT_SANITIZATION = 'Text Sanitization Rules'
const FILTER_TEXT_WHITELIST = 'Whitelist'
const FILTER_UNRATED = 'Unrated'
const STORE_SUBSCRIPTIONS = 'Account Subscriptions'

// 保留原有属性名
const ITEM_NAME = 'name'
const ITEM_PROCESSED_ONCE = 'processedOnce'

// 配置选项汉化
const OPTION_ENABLE_TEXT_BLACKLIST = '启用文本黑名单'
const OPTION_ENABLE_TAG_BLACKLIST = '启用标签黑名单'
const OPTION_ALWAYS_SHOW_SETTINGS_PANE = '始终显示设置面板'
const OPTION_DISABLE_COMPLIANCE_VALIDATION = '禁用所有过滤器'

// 在构造函数中修改的UI文本
this._uiGen.createFormButton('应用', '应用设置', () => this._onApplyNewSettings())
this._uiGen.createFormButton('保存', '保存配置', () => this._onSaveSettings())
this._uiGen.createFormButton('重置', '恢复保存的配置', () => this._onResetSettings())

// 其他汉化示例（保持原有逻辑）：
this._configurationManager
    .addFlagField(OPTION_ENABLE_TEXT_BLACKLIST, '应用黑名单过滤')
    .addRulesetField(
        FILTER_TEXT_BLACKLIST,
        5,
        '每行一个关键词，使用英文双引号包裹短语',
        // 保留原有处理逻辑...
    )
this._configurationManager.addRangeField(FILTER_DURATION_RANGE, 0, 100000, '按视频时长过滤（分钟）')
this._configurationManager.addTagRulesetField(FILTER_TAG_BLACKLIST, 5, '输入标签黑名单，每行一个规则，使用"&"和"|"组合')
this._uiGen.updateStatus('初始运行完成！')

// 保留所有功能逻辑代码不变，例如：
class BrazenBaseSearchEnhancer {
    constructor(config) {
        // 构造函数逻辑保持不变
    }
    // 所有方法实现保持原样
}
