importCssList = [
	//bootstrap
	'/css/sb-admin.css',
	'/css/dropzone_styles.css',
	'/vendor/fontawesome-free/css/all.min.css',
	'/vendor/datatables/dataTables.bootstrap4.css'
]

var html = '';
for(var i=0, path; path=importCssList[i]; i++)
	html += "<link href='/static" + path + "' rel='stylesheet'>"
	
document.write(html);

