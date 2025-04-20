// ==UserScript==
// @name         Hitomi - 搜索与界面优化
// @namespace    brazenvoid
// @version      6.1.6
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  各种搜索过滤器和用户体验增强功能
// @match        https://hitomi.la/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/1244990/Base%20Brazen%20Resource.js
// @require      https://github.com/Ywocp/Hitomi---/raw/refs/heads/main/Brazen%20UI%20Generator.is
// @require      https://update.greasyfork.org/scripts/418665/1408619/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/1244644/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://github.com/Ywocp/Hitomi---/raw/refs/heads/main/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL  https://github.com/Ywocp/Hitomi---/raw/refs/heads/main/Hitomi%20-%20%E6%90%9C%E7%B4%A2%E4%B8%8E%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.js
// ==/UserScript==

GM_addStyle(
    `#settings-wrapper{min-width:400px;width:400px}.disliked-tag{background-color:lightcoral !important}.disliked-tag:hover{background-color:indianred !important}.disliked-tag.favourite-tag{background-color:orange !important}.disliked-tag.favourite-tag:hover{background-color:darkorange !important}.favourite-tag{background-color:mediumseagreen !important}.favourite-tag:hover{background-color:forestgreen !important}`)
const IS_GALLERY_PAGE = $('#dl-button').length
const FILTER_GALLERY_TYPES = '显示画廊类型'
const FILTER_PAGES = '页数'
const FILTER_LANGUAGES = '语言'
const OPTION_REMOVE_RELATED_GALLERIES = '移除相关画廊'
const UI_FAVOURITE_TAGS = '收藏标签'
const UI_DISLIKED_TAGS = '厌恶标签'
const UI_SHOW_ALL_TAGS = '显示所有画廊标签'
const ITEM_GALLERY_TYPE = '画廊类型'
const ITEM_LANGUAGE = '语言'

class HitomiSearchAndUITweaks extends BrazenBaseSearchEnhancer {
    constructor() {
        super({
            isUserLoggedIn: false,
            itemDeepAnalysisSelector: '',
            itemLinkSelector: '',
            itemListSelectors: '.gallery-content',
            itemNameSelector: 'h1.lillie a',
            itemSelectors: '.anime,.acg,.dj,.cg,.imageset,.manga',
            requestDelay: 0,
            scriptPrefix: 'hitomi-sui-',
            tagSelectorGenerator: (tag) => {
                let selector
                tag = encodeURIComponent(tag.trim()).replace('-', '%2D')
                if (tag.startsWith('artist%3A')) {
                    selector = 'a[href="/artist/' + tag.replace('artist%3A', '') + '-all.html"]'
                } else if (tag.startsWith('series%3A')) {
                    selector = 'a[href="/series/' + tag.replace('series%3A', '') + '-all.html"]'
                } else {
                    selector = 'a[href="/tag/' + tag + '-all.html"]'
                }
                return selector
            },
        })
        this._setupFeatures()
        this._setupUI()
        this._setupEvents()
    }

    /**
     * @private
     */
    _setupEvents() {
        if (IS_GALLERY_PAGE) {
            this._onUIBuild(() => this._performComplexOperation(
                FILTER_PAGES,
                (range) => !this._getConfig(OPTION_DISABLE_COMPLIANCE_VALIDATION) && this._configurationManager.generateValidationCallback(FILTER_PAGES)(range),
                (range) => {
                    let navPages = $('.simplePagerNav li').length
                    let pageCount = navPages > 0 ? navPages * 50 : $('.simplePagerPage1').length
                    if (!Validator.isInRange(pageCount, range.minimum, range.maximum)) {
                        top.close()
                    }
                }),
            )
            this._onUIBuild(
                () => this._performOperation(OPTION_REMOVE_RELATED_GALLERIES, () => $('.gallery-content').remove()))
        }
        this._onUIBuilt(() => this._uiGen.getSelectedSection()[0].userScript = this)
        this._onFirstHitAfterCompliance.push((item) => {
            this._performComplexOperation(UI_SHOW_ALL_TAGS, (flag) => flag && !IS_GALLERY_PAGE, () => {
                let 标签 = item.find('.relatedtags > ul > li')
                let lastTag = 标签.last()
                if (lastTag.text() === '...') {
                    lastTag.remove()
                    标签.filter('.hidden-list-item').removeClass('hidden-list-item')
                }
            })
        })
    }

    /**
     * @private
     */
    _setupFeatures() {
        this._configurationManager
            .addCheckboxesGroup(FILTER_GALLERY_TYPES, [
                ['动漫', 'anime'],
                ['艺术家CG', 'acg'],
                ['同人志', 'dj'],
                ['游戏CG', 'cg'],
                ['图片集', 'imageset'],
                ['漫画', 'manga'],
            ], '仅显示选定的画廊类型。')
            .addCheckboxesGroup(FILTER_LANGUAGES, [
                ['无', 'not-applicable'],
                ['日语', 'japanese'],
                ['中文', 'chinese'],
                ['英语', 'english'],
                ['阿尔巴尼亚语', 'albanian'],
                ['阿拉伯语', 'arabic'],
                ['保加利亚语', 'bulgarian'],
                ['加泰罗尼亚语', 'catalan'],
                ['宿务语', 'cebuano'],
                ['捷克语', 'czech'],
                ['丹麦语', 'danish'],
                ['荷兰语', 'dutch'],
                ['世界语', 'esperanto'],
                ['爱沙尼亚语', 'estonian'],
                ['芬兰语', 'finnish'],
                ['法语', 'french'],
                ['德语', 'german'],
                ['希腊语', 'greek'],
                ['希伯来语', 'hebrew'],
                ['匈牙利语', 'hungarian'],
                ['印度尼西亚语', 'indonesian'],
                ['意大利语', 'italian'],
                ['韩语', 'korean'],
                ['拉丁语', 'latin'],
                ['蒙古语', 'mongolian'],
                ['挪威语', 'norwegian'],
                ['波斯语', 'persian'],
                ['波兰语', 'polish'],
                ['葡萄牙语', 'portuguese'],
                ['罗马尼亚语', 'romanian'],
                ['俄语', 'russian'],
                ['斯洛伐克语', 'slovak'],
                ['西班牙语', 'spanish'],
                ['瑞典语', 'swedish'],
                ['他加禄语', 'tagalog'],
                ['泰语', 'thai'],
                ['土耳其语', 'turkish'],
                ['乌克兰语', 'ukrainian'],
                ['未指定', 'unspecified'],
                ['越南语', 'vietnamese'],
            ], '选择要显示的语言')
            .addFlagField(OPTION_REMOVE_RELATED_GALLERIES, '从画廊页面移除相关画廊部分。')
            .addFlagField(UI_SHOW_ALL_TAGS, '在搜索结果中显示所有画廊标签。')
            .addRangeField(FILTER_PAGES, 0, Infinity, '关闭不满足这些页数限制的画廊页面，仅对新标签页打开的画廊有效。')
        this._itemAttributesResolver
            .addAttribute(ITEM_GALLERY_TYPE, (item) => item.attr('class'))
            .addAttribute(ITEM_LANGUAGE, (item) => {
                let link = item.find('tr:nth-child(3) > td:nth-child(2) a')
                if (link.length) {
                    return link.attr('href').replace('/index-', '').replace('.html', '')
                }
                return 'not-applicable'
            })
        this._addItemComplianceFilter(FILTER_LANGUAGES, ITEM_LANGUAGE)
        this._addItemComplianceFilter(FILTER_GALLERY_TYPES, ITEM_GALLERY_TYPE)
        let otherTagSections = IS_GALLERY_PAGE ? $('.tags') : null
        this._addItemTagHighlights(UI_FAVOURITE_TAGS, otherTagSections, 'favourite-tag', '高亮指定的收藏标签，可以使用"&" "|"。')
        this._addItemTagHighlights(UI_DISLIKED_TAGS, otherTagSections, 'disliked-tag', '高亮指定的厌恶标签，可以使用"&" "|"。')
        this._addItemTagBlacklistFilter(8)
    }

    /**
     * @private
     */
    _setupUI() {
        this._userInterface = [
            this._uiGen.createTabsSection(['过滤器', '高亮', '语言', '全局', '统计'], [
                this._uiGen.createTabPanel('过滤器', true).append([
                    this._configurationManager.createElement(FILTER_GALLERY_TYPES),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(FILTER_PAGES),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(OPTION_ENABLE_TAG_BLACKLIST),
                    this._configurationManager.createElement(FILTER_TAG_BLACKLIST),
                ]),
                this._uiGen.createTabPanel('高亮').append([
                    this._configurationManager.createElement(UI_FAVOURITE_TAGS),
                    this._configurationManager.createElement(UI_DISLIKED_TAGS),
                ]),
                this._uiGen.createTabPanel('语言').append([
                    this._configurationManager.createElement(FILTER_LANGUAGES),
                ]),
                this._uiGen.createTabPanel('全局').append([
                    this._configurationManager.createElement(UI_SHOW_ALL_TAGS),
                    this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
                    this._uiGen.createSeparator(),
                    this._createSettingsBackupRestoreFormActions(),
                ]),
                this._uiGen.createTabPanel('统计').append([
                    this._uiGen.createStatisticsFormGroup(FILTER_GALLERY_TYPES),
                    this._uiGen.createStatisticsFormGroup(FILTER_LANGUAGES),
                    this._uiGen.createStatisticsFormGroup(FILTER_TAG_BLACKLIST),
                    this._uiGen.createSeparator(),
                    this._uiGen.createStatisticsTotalsGroup(),
                ]),
            ]),
            this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
            this._uiGen.createSeparator(),
            this._createSettingsFormActions(),
            this._uiGen.createSeparator(),
            this._uiGen.createStatusSection(),
        ]
    }
}
(new HitomiSearchAndUITweaks).init()
