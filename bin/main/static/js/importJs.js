importJsList = [
	'/js/SOAF.js',
	'/js/axios.js',
	'/js/common.js',
	'/js/dropzone.js',
	
	//bootstrap
	'/vendor/jquery/jquery.min.js',
	'/vendor/jquery-easing/jquery.easing.min.js',
	'/vendor/bootstrap/js/bootstrap.bundle.min.js',
	'/js/sb-admin.min.js',
	'/vendor/chart.js/Chart.min.js',
	'/vendor/datatables/jquery.dataTables.js',
	'/vendor/datatables/dataTables.bootstrap4.js'
]

var html = '';
for(var i=0, path; path=importJsList[i]; i++)
	html += "<script src='/static" + path + "'></script>"
	
document.write(html);


