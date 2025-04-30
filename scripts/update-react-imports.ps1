$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace React namespace import with specific imports
    $content = $content -replace 'import \* as React from "react"', 'import { forwardRef, type HTMLAttributes } from "react"'
    
    # Replace React.forwardRef with forwardRef
    $content = $content -replace 'React\.forwardRef', 'forwardRef'
    
    # Replace React.HTMLAttributes with HTMLAttributes
    $content = $content -replace 'React\.HTMLAttributes', 'HTMLAttributes'
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content
}
