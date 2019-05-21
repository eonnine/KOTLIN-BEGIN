/**
 * @param args { 
 * 							id: 파일 업로드 영역 ID
 * 						 }
 * 
 * Dropzone.getDropzoneFiles : 현재 드랍존에 있는 파일 목록을 가져옴
 * Dropzone.getFormData : 드랍존에 있는 파일 목록을 FormData로 가져옴 (요청 파라미터용)
 * 
 * 예제
 *  com.dtnc.test.testFile.java
 *  WEB-INF/views/pages/test/file.jsp
 */
function Dropzone(args) {
	
	if(this instanceof Dropzone == false) throw 'Dropzone : new 연산자가 선언되지 않았습니다';
	if(args.id == undefined) throw 'Dropzone : id 속성은 필수입니다';
	
	var _this = this;
	var _dropzoneFileMessage = 'drop files here'; //드랍존 기본 메시지
	var _closeBtnClass = 'dropzone_delete_button';
	var _maxFileSize = '300000'; //파일 업로드 사이즈 제한, 아직 적용 X
	
	var _dropzoneId = args.id; //드랍존 영역 ID
	var _readonly = args.readonly != undefined ? args.readonly : false; //읽기 전용
	var _files = {}; //드랍존의 파일 정보를 key-value 형태로 저장, key 형식 = 등록일자 long타입 + 현재 시간의 밀리세컨드 + 파일 등록 시 현재 인덱스
	
	/**
	 * 파일 목록 호출
	 */
	_this.getFiles = function(fileIdx){
		
		_this.clear();

		var d = new Date();
		ajaxJsonParam('/scm/getExistFiles.dtnc', { fileIdx : fileIdx }, function(data){
			for(var i in data){
				var lastModified = Date.parse(data[i].udtDate); 
				var key = lastModified + '-' + d.getMilliseconds() + '-' + i; //파일을 구분할 key,  생성 규칙 : 등록일자 long타입 + 현재 시간의 밀리세컨드 + 파일 등록 시 현재 인덱스
				
				_this.ParseFile(data[i], key);
				
				_files[key] = data[i];
			}
			
			_this.ToggleMessage();
		});
		
	}
	
	/**
	 * 현재 드랍존에 있는 파일들의 목록을 배열로 리턴 (새로 등록한 파일만)
	 */
	_this.getDropzoneFiles = function(){
		var rows = document.querySelectorAll('[dropzone-file-row]');
		var res = [];
		
		for(var i=0, f=rows[i]; i<rows.length; i++){
			var key = rows[i].querySelector('[key]').innerHTML;
			res.push(_files[key]);
		}
		return res;
	}
	
	/**
	 * 파라미터인 formData에 업로드할 파일 목록 추가
	 */
	_this.addFileToFormData = function(formData){
		var files = _this.getDropzoneFiles();
		
		for(var i in files){
			if(files[i].fileIdx == undefined)
				formData.append('files', files[i]);
		}
		
		return formData;
	}
	
	/**
	 * submit할 Form의 id
	 * ajaxJsonFile 메소드에 파라미터로 사용할 FormData를 리턴
	 */
	_this.getFormData = function(formId){
		var res;
		
		if(formId == undefined)
			res = new FormData();
		else{
			var form = document.getElementById(formId);
			res = new FormData(form);
		}
		
		return _this.addFileToFormData(res);
	}
	
	/**
	 * 파라미터 형식이 Object일 때
	 * ajaxJsonFile 메소드에 파라미터로 사용할 FormData를 리턴
	 */
	_this.getFormDataObject = function(obj){
		
		if(typeof obj != 'object') 
			throw 'Dropzone : getFormDataObject : 파라미터 형식이 Object가 아닙니다.';
		
		var res = new FormData();
		
		for(var key in obj){ //parameter = object
			formDataKeyValidator(key);
			res.append(key, obj[key]);
		}
		
		return _this.addFileToFormData(res);
	}
	
	/**
	 * 파라미터 형식이 Array일 때
	 * ajaxJsonFile 메소드에 파라미터로 사용할 FormData를 리턴
	 */
	_this.getFormDataArray = function(paramNm, arr){
		
		if(typeof arr != 'object' || ( typeof arr == 'object' && Array.isArray(arr) == false ) ) 
			throw 'Dropzone : getFormDataArray : 파라미터 형식이 Array가 아닙니다.';
		
		var res = new FormData();
		
		for(var i=0; i<arr.length; i++){
			for(var k in arr[i]){
				res.append(paramNm + '[' + i + '].'  + k, arr[i][k]);
			}
		}
		
		return _this.addFileToFormData(res);
	}
	
	/**
	 * 드랍존 영역 click 이벤트 핸들러
	 */
	_this.FileDragClick = function(e){
		//e.stopPropagation();
		e.preventDefault();
		var alt = e.target.getAttribute('alt');
		if( alt != 'btnDelete' && alt != 'btnDownload') //삭제 버튼, 다운로드 버튼이 아니라면 
			document.getElementById(_dropzoneId+'_fileList').click();
	}
	
	/**
	 * 드랍존 마우스 hover 이벤트 핸들러
	 */
	_this.FileDragMouseHover = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == 'mouseenter' ? 'mhover' : '');
	}
	
	/**
	 * 드랍존 드래그 hover 이벤트 핸들러
	 */
	_this.FileDragHover = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == 'dragenter' ? 'hover' : '');
	}
	
	_this.PreventEvent = function(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	/**
	 * 드랍존에 새로운 파일을 추가할 때의 이벤트 핸들러
	 */
	// file selection
	_this.FileSelectHandler = function(e) {
		// cancel event and hover styling
		_this.FileDragMouseHover(e);
		_this.FileDragHover(e);
		
		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
		
		// process all File objects
		var d = new Date();
		for (var i = 0, f; f = files[i]; i++) {
			var key = f.lastModified + '-' + d.getMilliseconds() + '-' + i;  //파일을 구분할 key,  생성 규칙 : 등록일자 long타입 + 현재 시간의 밀리세컨드 + 파일 등록 시 현재 인덱스
			_this.ParseFile(f, key);
			_files[key] = f;
		}
		
		_this.ToggleMessage();
		// init input file value
		e.target.value = '';
		
	}
	
	/**
	 * 파일 삭제 이벤트 핸들러
	 */
	_this.deleteFileEventHandler = function(file, fileKey){
		var BtnDelete = document.getElementById(fileKey + '_delete');
		
		BtnDelete.addEventListener('click', function(e){
			if(!confirm(file.name + ' 을(를) 삭제하시겠습니까?')) return false;
			
			var param = {};
			
			var rows = document.querySelectorAll('[dropzone-file-row]');
			var removeKey;
			for(var i=0, f=rows[i]; i<rows.length; i++){
				var key = rows[i].querySelector('[key]').innerHTML;
				if(fileKey == key){
					param.fileIdx = rows[i].querySelector('[idx]').innerHTML;
					param.fileSeq = rows[i].querySelector('[seq]').innerHTML;
					
					while (rows[i].firstChild) { // 해당 행 요소 삭제
						rows[i].removeChild(rows[i].firstChild);
					}
					rows[i].remove();
					
					removeKey= key;
					break;
				}
			}
			
			delete _files[removeKey]; //파일 목록 객체에서 삭제된 행에 해당하는 파일 정보 삭제
			ajaxJsonParam('/scm/deleteFile.dtnc', param);
		});
	}
	
	/**
	 * 파일 다운로드 이벤트 핸들러
	 */
	_this.downloadFileEventHandler = function(file, fileKey){
		var BtnDownload = document.getElementById(fileKey + '_download');

		BtnDownload.addEventListener('click', function(e){
			if(file.fileIdx == undefined)
				alert("저장된 파일만 다운로드할 수 있습니다");
			else{
				location.href = "/scm/downloadAction.dtnc?fileIdx=" + file.fileIdx + "&fileSeq=" + file.fileSeq;
			}
			
		});
	}

	/**
	 * 드랍존에 파일 html을 세팅
	 */
	_this.ParseFile = function(file, key) {
		
		var thumbnail;
		if(file.fileIdx != undefined)
			thumbnail = '<img src="/scm/getFileImage.dtnc?fileIdx=' + file.fileIdx + '&fileSeq=' + file.fileSeq + '" style="width:18px; height:18px; margin-right:3px;"/>';
		else
			thumbnail = '<img src="/assets/images/defaultImg300x300.png" style="width:18px; height:18px; margin-right:3px;"/>';
			
		var html = '<span dropzone-file-row><p>'
				+ '&nbsp;&nbsp;'
				+ thumbnail
				+ '<img src="/assets/images/arrow.png" style="width:18px; height:18px;  cursor:pointer;" alt="btnDownload" id="'+ key + '_download' +'" />'
				+ '&nbsp;'
				+ 'file: <strong>' + file.name + '</strong>&nbsp;&nbsp;&nbsp;'
				+ 'type: <strong>' + file.type + '</strong>&nbsp;&nbsp;&nbsp;'
				+ 'size: <strong>' + file.size + '</strong>bytes'
				+ '<data style="display:none;">'
				+ '<span idx>' + (file.fileIdx||'') + '</span><span seq>' + (file.fileSeq||'') + '</span><span key>' + key + '</span>'
				+ '</data>'
				+ '<b style="width:10px; height:10px; margin-left:5px; font-size:10px; cursor:pointer;" alt="btnDelete" class="' + _closeBtnClass + '"  id="'+ key + '_delete' +'" >X</b>'
				+ '</p></span>';
		
		var m = document.getElementById(_dropzoneId+'_fileDragArea');
		m.insertAdjacentHTML('beforeend', html);
		
		_this.deleteFileEventHandler(file, key);
		_this.downloadFileEventHandler(file, key);
		
	}
	
	/**
	 * 드랍존 html 생성
	 */
	_this.CreateDropzone = function(areaId) {
		var html = '<fieldset>'
 		             + '<input type="file" id="'+_dropzoneId+'_fileList" name="fileselect[]" multiple="multiple"/>'
 		             + '<div id="'+_dropzoneId+'_fileDragArea" fileDragArea><p dropzone-file-area-message>'+_dropzoneFileMessage+'</p></div>'
		             + '</fieldset>';

		document.getElementById(areaId).innerHTML = html;
	}
	
	/**
	 * 드랍존 기본 메세지 제어, 드랍존 내에 파일이 있다면 숨김
	 */
	_this.ToggleMessage = function(flag){
		
		if(flag == undefined || flag == 'default'){
			if(document.querySelector('[dropzone-file-row]') != undefined)
				document.querySelector('[dropzone-file-area-message]').style.display = 'none';
			else
				document.querySelector('[dropzone-file-area-message]').style.display = 'block';
		}
		
		if(flag == 'readonly'){
			document.querySelector('[dropzone-file-area-message]').style.display = 'none';
		}
			
		
	}
	
	/**
	 * 드랍존 클리어
	 */
	_this.clear = function(){
		for(var i in _files) delete _files[i];
		document.getElementById(_dropzoneId+'_fileDragArea').innerHTML = '<p dropzone-file-area-message>'+_dropzoneFileMessage+'</p>';
	}
	
	_this.readonly = function(flag){
		_closeBtnClass = flag == true ? 'dropzone_delete_button_hide' : 'dropzone_delete_button';
		_dropzoneFileMessage = flag == true ? 'read only' : 'drop files here';
	}
	
	/**
	 * 드랍존 기본 이벤트리스터 추가
	 */
	_this.addEventListener = function(){
		var fileList = document.getElementById(_dropzoneId+'_fileList');
		// input file event listener
		fileList.addEventListener('change', _this.FileSelectHandler, false);
		
		var fileDragArea = document.getElementById(_dropzoneId+'_fileDragArea');
		// file drop area add event listener
		fileDragArea.addEventListener('click', _this.FileDragClick, true);
		fileDragArea.addEventListener('drop', _this.FileSelectHandler, false);
		fileDragArea.addEventListener('mouseover', _this.PreventEvent, false);
		fileDragArea.addEventListener('mouseenter', _this.FileDragMouseHover, false);
		fileDragArea.addEventListener('mouseleave', _this.FileDragMouseHover, false);
		fileDragArea.addEventListener('dragover', _this.PreventEvent, false);
		fileDragArea.addEventListener('dragenter', _this.FileDragHover, false);
		fileDragArea.addEventListener('dragleave', _this.FileDragHover, false);
	}

	/**
	 * 드랍존 기본 이벤트리스터 삭제
	 */
	_this.removeEventListener = function(){
		var fileList = document.getElementById(_dropzoneId+'_fileList');
		// input file event listener
		fileList.removeEventListener('change', _this.FileSelectHandler);
		
		var fileDragArea = document.getElementById(_dropzoneId+'_fileDragArea');
		// file drop area remove event listener
		fileDragArea.removeEventListener('click', _this.FileDragClick);
		fileDragArea.removeEventListener('drop', _this.FileSelectHandler);
		fileDragArea.removeEventListener('mouseover', _this.PreventEvent);
		fileDragArea.removeEventListener('mouseenter', _this.FileDragMouseHover);
		fileDragArea.removeEventListener('mouseleave', _this.FileDragMouseHover);
		fileDragArea.removeEventListener('dragover', _this.PreventEvent);
		fileDragArea.removeEventListener('dragenter', _this.FileDragHover);
		fileDragArea.removeEventListener('dragleave', _this.FileDragHover);
	}
	
	/**
	 * 드랍존 초기화
	 */
	// initialize
	_this.Init = function() {
		
		//set readonly mode
		_this.readonly(_readonly);
		
		//create file drag&drop area
		_this.CreateDropzone(_dropzoneId);
		
		// file drop area add event listener
		if(_readonly == false)
			_this.addEventListener();
		
		var fileList = document.getElementById(_dropzoneId+'_fileList');
		// hide button
		fileList.style.display = 'none';
		
		_this.ToggleMessage();

	};

	_this.Init();
	
	return _this;
};



/**
 * 파라미터 형식이 Array이고, 파일 객체 배열을 파라미터로 받을 때
 * ajaxJsonFile 메소드에 파라미터로 사용할 FormData를 리턴
 */
var getFormDataFiles = function(args){
	
	var formData;

	if(args.formData == undefined)
		formData = new FormData();
	else
		formData = args.formData;
	
	if(args.arrayObject != undefined){
		var dataObject = args.arrayObject;
		for(var propertyName in dataObject){
			var arrayData = dataObject[propertyName];
			for(var i=0; i<arrayData.length; i++){
				for(var k in arrayData[i]){
					formData.append(propertyName + '[' + i + '].'  + k, arrayData[i][k]);
				}
			}
		}
	}
	
	
	if(args.files != undefined){
		var filesObj = args.files;
		
		var fileArr = [];
		for(var key in filesObj){
			formDataKeyValidator(key);
			formData.append(key, filesObj[key]);
		}
	}
	
	return formData;
}


function formDataKeyValidator(key){
	if(key == 'files'){
		alert('files는 예약어입니다. 다른 키를 지정해주세요.');
		throw 'files는 예약어입니다. 다른 키를 지정해주세요.';
	}
}