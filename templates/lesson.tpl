<div id="content" data-location="{$location}" data-name="{$name}" data-userstatus="{$userStatus}">
    {*<div id="print_container"><a class="action-print" href="#">Print</a> | <a class="action-pdf" href="#">PDF</a></div>*}
    <div id="print_container">
        <a class="action-print" href="#">Print</a> | 
        <a class="action-word" href="/docs/{$docname}.docx">Word Document</a>
    </div>
	{$content}
</div>
