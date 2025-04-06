// ==UserScript==
// @name         Brazen 基础搜索增强器
// @namespace    brazenvoid
// @version      6.3.1
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  搜索增强脚本的基础类
// ==/UserScript==
const ICON_RECYCLE = '&#x267B'
// 预设过滤器配置键
const CONFIG_PAGINATOR_LIMIT = '分页限制'
const CONFIG_PAGINATOR_THRESHOLD = '分页阈值'
const FILTER_DURATION_RANGE = '时长'
const FILTER_PERCENTAGE_RATING_RANGE = '评分'
const FILTER_SUBSCRIBED_VIDEOS = '隐藏订阅视频'
const FILTER_TAG_BLACKLIST = '标签黑名单'
const FILTER_TEXT_BLACKLIST = '文字黑名单'
const FILTER_TEXT_SEARCH = '搜索'
const FILTER_TEXT_SANITIZATION = '文本清理规则'
const FILTER_TEXT_WHITELIST = '白名单'
const FILTER_UNRATED = '未评分'
const STORE_SUBSCRIPTIONS = '账户订阅'
// 项目预设属性
const ITEM_NAME = '名称'
const ITEM_PROCESSED_ONCE = '已处理'
// 配置项
const OPTION_ENABLE_TEXT_BLACKLIST = '启用文字黑名单'
const OPTION_ENABLE_TAG_BLACKLIST = '启用标签黑名单'
const OPTION_ALWAYS_SHOW_SETTINGS_PANE = '始终显示设置面板'
const OPTION_DISABLE_COMPLIANCE_VALIDATION = '禁用所有过滤器'
class BrazenBaseSearchEnhancer
{
    // ...（其他代码保持不变）

    constructor(configuration)
    {
        // ...（构造函数保持不变）

        this._configurationManager
            .onExternalConfigurationChange(() => this._validateCompliance())
            .addFlagField(OPTION_DISABLE_COMPLIANCE_VALIDATION, '禁用所有过滤器')
            .addFlagField(OPTION_ALWAYS_SHOW_SETTINGS_PANE, '始终显示配置界面')
        
        // ...（其他代码保持不变）

        this._syncConfigButton = $('<button id="brazen-sync-config-btn" style="position: fixed"></button>')
            .text(ICON_RECYCLE)
            .hide()
            .appendTo($('body'))
            .on('click', () => {
                this._onResetSettings()
                this._syncConfigButton.hide()
            })
    }

    // ...（其他方法保持不变）

    _addItemBlacklistFilter(helpText)
    {
        this._configurationManager
            .addFlagField(OPTION_ENABLE_TEXT_BLACKLIST, '应用黑名单')
            .addRulesetField(
                FILTER_TEXT_BLACKLIST,
                5,
                helpText,
                null,
                null,
                (rules) => Utilities.buildWholeWordMatchingRegex(rules) ?? '',
            )
    }

    // ...（其他方法保持不变）

    _addItemTagBlacklistFilter(rows = 5, helpText = null)
    {
        if (helpText === null) {
            helpText = '每行指定一个标签黑名单规则，支持&和|分隔符'
        }
        this._configurationManager
            .addFlagField(OPTION_ENABLE_TAG_BLACKLIST, '应用黑名单')
            .addTagRulesetField(FILTER_TAG_BLACKLIST, rows, helpText)
    }

    // ...（其他方法保持不变）

    _createSettingsBackupRestoreFormActions()
    {
        return this._uiGen.createFormActions([
            this._uiGen.createFormButton(
                '备份配置', '将配置备份到剪贴板', () => this._onBackupSettings()),
            this._uiGen.createSeparator(),
            this._uiGen.createFormGroupInput('text')
                .attr('id', 'restore-settings')
                .attr('placeholder', '粘贴配置...'),
            this._uiGen.createFormButton(
                '恢复配置', '从上方字段恢复配置', () => this._onRestoreSettings()),
        ], 'bv-flex-column');
    }

    _createSettingsFormActions()
    {
        return this._uiGen.createFormActions([
            this._uiGen.createFormButton('应用', '应用设置', () => this._onApplyNewSettings()),
            this._uiGen.createFormButton('保存', '保存配置', () => this._onSaveSettings()),
            this._uiGen.createFormButton('重置', '恢复已保存配置', () => this._onResetSettings()),
        ]);
    }

    // ...（其他方法保持不变）

    _createSubscriptionLoaderControls()
    {
        let button = this._uiGen.createFormButton('加载订阅', '将订阅缓存用于相关过滤器', (event) => {
            if (this._config.isUserLoggedIn) {
                $(event.currentTarget).prop('disabled', true)
                this._subscriptionsLoader.run()
            } else {
                this._showNotLoggedInAlert()
            }
        })
        return button.attr('id', 'subscriptions-loader')
    }

    // ...（其他方法保持不变）

    _showNotLoggedInAlert()
    {
        alert('使用此功能需要登录')
    }

    // ...（其他方法保持不变）
}
