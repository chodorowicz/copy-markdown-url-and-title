#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Copy URL and Title (applescript)
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🤖

# Documentation:
# @raycast.description Open a new window on Brave
# @raycast.author Harry Chuang
# @raycast.authorURL https://chodorowicz.com

use scripting additions
use framework "Foundation"

# get active app name
set active_app to name of application "System Events"

## if active app is Firefox, then copy url and title
if active_app is "Firefox" then
tell application active_app
    set frontmost to true
    keystroke "l" using {command down}
    delay 0.2
    keystroke "a" using {command down}
    delay 0.2
    keystroke "c" using {command down}
    delay 0.2
    set the_url to the clipboard
    set the_title to name of windows's item 1
    set the_markdown to "[" & the_title & "](" & the_url & ")" as text
    set the clipboard to the_markdown
  end tell
end tell
