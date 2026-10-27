local GLUE_FONT_NAMES = {
    "GlueFontNormal", "GlueFontNormalSmall", "GlueFontNormalLarge",
    "GlueFontHighlight", "GlueFontHighlightSmall", "GlueFontHighlightLarge",
    "GlueFontDisable", "GlueFontDisableSmall", "GlueFontDisableLarge",
    "GlueFontGold", "GlueFontGoldSmall", "GlueFontGoldLarge",
    "GlueFontEditBox", "GlueFontBig", "GlueFontWhite",
}

function VanillaBonkGlueFonts_Apply()
    if not VanillaBonkLocale or not VanillaBonkLocale.IsZh or not VanillaBonkLocale.IsZh() then
        return
    end
    local zhFont = "Interface\\AddOns\\HordesOfAzeroth\\Fonts\\ZhFont.ttf"
    for _, name in ipairs(GLUE_FONT_NAMES) do
        local font = getglobal(name)
        if font and font.SetFont then
            local ok, current, size, flags = pcall(font.GetFont, font)
            if ok and current then
                font:SetFont(zhFont, size or 12, flags or "")
            else
                font:SetFont(zhFont, 12, "")
            end
        end
    end
end

VanillaBonkGlueFonts_Apply()
