# Browser Test Notes - Round 2

Looking at the calendar screenshot more carefully:
- Row 1: 4,5,6,7,8,9,10 (these are buttons 4-10 in the index)
- Row 2: 11,12,13,14,15,16,17
- Row 3: 18,19,20,21,22,23,24
- Row 4: 25,26,27,28,29,30,31
- Row 5: 32,33,34 then plain text "25,26,27,28"

The issue: buttons 32,33,34 correspond to days 29,30,31 (since button index starts at 4 for day 1).
The plain text "25,26,27,28" below are NOT buttons - they might be rendering from somewhere else.

Wait - actually the calendar grid shows 7 columns. March 2026 starts on Sunday (day 0). 
So no empty offset cells. 31 days = 4 full rows + 3 extra = 5 rows total.
The "25 26 27 28" at the bottom might be from the 5th row wrapping oddly.

Actually I think the issue is that the grid is rendering fine but there might be extra text from somewhere.
Let me just focus on fixing the + button navigation and the numpad spacing.
