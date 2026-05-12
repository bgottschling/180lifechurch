$user = "tech@180lifechurch.org"
$token = "your-app-password-here"
$pair = "${user}:${token}"
$encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($pair))
$headers = @{
    Authorization = "Basic $encoded"
    "User-Agent"  = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}

Invoke-RestMethod -Uri "https://180lifechurch.org/wp-json/" -Headers $headers | Select-Object name, description
# List
#$items = Invoke-RestMethod -Uri "https://180lifechurch.org/wp-json/wp/v2/ministry?per_page=20&_fields=id,title,slug" -Headers $headers
#$items | Format-Table id, slug, @{Name='title'; Expression={$_.title.rendered}}

# Delete (uncomment after verifying the list above is what you want gone)
# foreach ($item in $items) {
#   Invoke-RestMethod -Method DELETE -Uri "https://180lifechurch.org/wp-json/wp/v2/ministry/$($item.id)?force=true" -Headers $headers
#   Write-Host "Deleted: $($item.title.rendered) (id=$($item.id))"
# }