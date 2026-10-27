VanillaBonkLocale = {}

local MARK_NUM = string.char(1)
local MARK_ENT = string.char(2)
local MARK_MON = string.char(3)

local texts = nil
local entities = nil
local templates = nil

local function IsZh()
    return texts ~= nil
end

function VanillaBonkLocale.IsZh()
    return IsZh()
end

local function CaptureNumber(text, pos)
    local s, e = strfind(text, "^%d[%d,]*", pos)
    if not s then
        return nil, pos
    end
    if strsub(text, e + 1, e + 1) == "." then
        local s2, e2 = strfind(text, "^%d+", e + 2)
        if s2 then
            e = e2
        end
    end
    return strsub(text, s, e), e + 1
end

local function CaptureMoney(text, pos)
    local s, e = strfind(text, "^%d+g( %d+s)?( %d+c)?", pos)
    if not s then
        return nil, pos
    end
    return strsub(text, s, e), e + 1
end

local function CaptureEntity(text, pos)
    for _, ent in ipairs(entities) do
        local len = strlen(ent)
        if strsub(text, pos, pos + len - 1) == ent then
            return ent, pos + len
        end
    end
    return nil, pos
end

local function SplitCaptures(pattern, text)
    local numbers = {}
    local ents = {}
    local monies = {}
    local pos = 1
    local i = 1
    local patternLen = strlen(pattern)
    local textLen = strlen(text)
    while i <= patternLen do
        local c = strsub(pattern, i, i)
        if c == MARK_NUM then
            local captured
            captured, pos = CaptureNumber(text, pos)
            if not captured then
                return nil
            end
            tinsert(numbers, captured)
            i = i + 1
        elseif c == MARK_ENT then
            local captured
            captured, pos = CaptureEntity(text, pos)
            if not captured then
                return nil
            end
            tinsert(ents, captured)
            i = i + 1
        elseif c == MARK_MON then
            local captured
            captured, pos = CaptureMoney(text, pos)
            if not captured then
                return nil
            end
            tinsert(monies, captured)
            i = i + 1
        else
            local j = i
            while j <= patternLen do
                local cj = strsub(pattern, j, j)
                if cj == MARK_NUM or cj == MARK_ENT or cj == MARK_MON then
                    break
                end
                j = j + 1
            end
            local lit = strsub(pattern, i, j - 1)
            local litLen = strlen(lit)
            if strsub(text, pos, pos + litLen - 1) ~= lit then
                return nil
            end
            pos = pos + litLen
            i = j
        end
    end
    if pos ~= textLen + 1 then
        return nil
    end
    return numbers, ents, monies
end

local function FormatMoney(captured)
    local text = gsub(captured, " ", "")
    text = gsub(text, "g", "\233\135\145")
    text = gsub(text, "s", "\233\147\182")
    text = gsub(text, "c", "\233\147\156")
    return text
end

local function BuildOutput(value, numbers, ents, monies)
    local out = {}
    local i = 1
    local len = strlen(value)
    while i <= len do
        local c = strsub(value, i, i)
        if c == MARK_NUM then
            local idx = strbyte(value, i + 1)
            local num = numbers and numbers[idx] or "?"
            tinsert(out, num)
            i = i + 2
        elseif c == MARK_ENT then
            local idx = strbyte(value, i + 1)
            local ent = ents and ents[idx] or nil
            tinsert(out, ent and VanillaBonkLocale.L(ent) or "")
            i = i + 2
        elseif c == MARK_MON then
            local idx = strbyte(value, i + 1)
            local mon = monies and monies[idx] or nil
            tinsert(out, mon and FormatMoney(mon) or "")
            i = i + 2
        else
            local j = i
            while j <= len do
                local cj = strsub(value, j, j)
                if cj == MARK_NUM or cj == MARK_ENT or cj == MARK_MON then
                    break
                end
                j = j + 1
            end
            tinsert(out, strsub(value, i, j - 1))
            i = j
        end
    end
    return table.concat(out)
end

local function MatchText(text)
    local hit = texts[text]
    if hit then
        return hit
    end
    local trimmed = gsub(text, "%s+$", "")
    if trimmed ~= text then
        local trimHit = texts[trimmed]
        if trimHit then
            return trimHit .. strsub(text, strlen(trimmed) + 1)
        end
    end
    local base = trimmed ~= text and trimmed or text
    for _, tpl in ipairs(templates) do
        local numbers, ents, monies = SplitCaptures(tpl[1], base)
        if numbers then
            return BuildOutput(tpl[2], numbers, ents, monies)
        end
    end
    return nil
end

function VanillaBonkLocale.L(text)
    if not IsZh() or type(text) ~= "string" or text == "" then
        return text
    end
    local hit = MatchText(text)
    if hit ~= nil then
        return hit
    end
    return text
end

local function JoinTables()
    templates = {}
    for key, value in pairs(texts) do
        if strfind(key, MARK_NUM) or strfind(key, MARK_ENT) or strfind(key, MARK_MON) then
            tinsert(templates, { key, value })
        end
    end
    table.sort(templates, function(a, b)
        return strlen(a[1]) > strlen(b[1])
    end)
end

function VanillaBonkLocale.SetLanguage(language)
    if language == "zhCN" and VanillaBonkLocaleZhCN then
        texts = VanillaBonkLocaleZhCN.texts
        entities = VanillaBonkLocaleZhCN.entities
        JoinTables()
    else
        texts = nil
        entities = nil
        templates = nil
    end
end

local DEFAULT_FONT = "Fonts\\FRIZQT__.TTF"
local DEFAULT_NUMBER_FONT = "Fonts\\ARIALN.TTF"
local DEFAULT_TITLE_FONT = "Fonts\\MORPHEUS.TTF"
local ZH_FONT = "Interface\\AddOns\\HordesOfAzeroth\\Fonts\\ZhFont.ttf"

function VanillaBonkLocale.Font()
    if IsZh() then
        return ZH_FONT
    end
    return DEFAULT_FONT
end

function VanillaBonkLocale.NumberFont()
    if IsZh() then
        return ZH_FONT
    end
    return DEFAULT_NUMBER_FONT
end

function VanillaBonkLocale.TitleFont()
    if IsZh() then
        return ZH_FONT
    end
    return DEFAULT_TITLE_FONT
end
