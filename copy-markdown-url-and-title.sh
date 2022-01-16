#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Copy Markdown URL and Title
# @raycast.mode silent
#
# Optional parameters:
# @raycast.packageName Copy Markdown URL and Title
# @raycast.icon 🔗
#
# Documentation:
# @raycast.description Copy URL and title from the current browser as markdown. Currently supported browsers are Brave Browser, Opera, Chrome, Vivaldi, Firefox, Safari
# @raycast.author Jakub Chodorowicz
# @raycast.authorURL https://github.com/chodorowicz

set the otherBrowsers to {"Firefox", "Safari"}
set the chromiumBrowsers to {"Google Chrome","Brave Browser","Opera", "Vivaldi"}

tell application "System Events"
	set frontmostProcess to first process where it is frontmost
	set appName to name of frontmostProcess
end tell

if appName is in chromiumBrowsers then
	using terms from application "Google Chrome"
		tell application appName
			tell active tab of front window
				set linkTitle to Title
				set linkUrl to URL
			end tell
		end tell
	end using terms from
end if

if appName is equal to "Safari" then
	tell application "Safari" to tell document 1
		set linkTitle to name
		set linkUrl to URL
	end tell
end if

if appName is equal to "Firefox" then
	tell application "Firefox"
		set linkTitle to name of front window

		tell application "System Events"
			tell process "firefox"
				keystroke "l" using {command down}
				delay 0.1
				keystroke "c" using {command down}
				delay 0.1
			end tell
		end tell

		set linkUrl to get the clipboard
	end tell
end if

if appName is in otherBrowsers or appName is in chromiumBrowsers then
	set the clipboard to "[" & linkTitle & "](" & linkUrl & ")"
	log "Markdown link copied from " & appName
end if
