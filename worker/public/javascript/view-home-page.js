var allNetworkSites = {};
var createSiteModalNodeId = '';
var newSiteCloneSourceNodeId = '';







jQuery( document ).ready(function( $ ) {
	
	
	getAllNodes( $, '1', 'false', 'true' );

	
	//show api key
	$( '#actionShowAPIKey' ).click(function( e ){
		e.preventDefault();
		$( this ).hide();
		$( '#showAPiKey' ).show();
	});
	
	
	$( '#wrapperSearchSiteList' ).on("click", '#actionCloseSearchResults', function( e ) { 
		e.preventDefault();
		$( '#wrapperSearchSiteList' ).slideUp();
		$( '#mainTopWrapper1div' ).slideDown();
	});
	
	
	
	
	
	
	
	//search network start
	$( '#actionSearchNetwork' ).submit(function( e ){
		e.preventDefault();
		
		$( '#wrapperSearchSiteList' ).slideUp();
		
		var searchType = $( '#searchType' ).val();
		var searchQuery = $( '#searchQuery' ).val();
		
		$( '#searchButton' ).addClass( 'disabled' ).html( '<i class="fas fa-spinner fa-spin me-1"></i> Searching...' );
		
		if( searchType == 'domain' ){
			searchNetwork( $, searchQuery );
		}
		
		if( searchType == 'unique-order-id' ){
			searchNetwork( $, null, searchQuery );
		}
		
		if( searchType == 'client-email' ){
			searchNetwork( $, null, null, searchQuery );
		}
		
		if( searchType == 'client-saas-member-id' ){
			searchNetwork( $, null, null, null, searchQuery );
		}
		
		if( searchType == 'site-id' ){
			searchNetwork( $, null, null, null, null, searchQuery );
		}
	
	});
	//search network end
	
	
	
	
	//dynamic onclick Create New site button show modal
	$( '#nodeList' ).on("click", '.btnCreateNewSite', function( e ) { 
		e.preventDefault();
		$('#modalCreateNewSite').modal('show'); //show modal
		
		var selectedNodeId = $(this).data('node-id');
		
		$('#newSiteNode').val( selectedNodeId ).change();
	});
	
	
	
	
	//dynamic onclick actionDeleteSite starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionDeleteSite', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Delete site ID: '+selectedSiteId+' on node ID: '+selectedNodeId,
		  text: 'Are you sure you want to delete this site.',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
				title: 'Please wait',
				text: 'Marking site for removal.',
				icon: 'warning',
				showConfirmButton: false,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			
			removeSite( $, selectedNodeId, selectedSiteId ).done( function(){
				location.reload();
			});
			
		  }
		});
		
	});
	
	
	
	
	
	
	//dynamic onclick actionDisableThemePlugins starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionDisableThemePlugins', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Disable Theme/Plugins for site ID: '+selectedSiteId+' on node ID: '+selectedNodeId,
		  text: 'This option is used to recover a site from a fatal error. Usually after importing a site. Do you want to proceed?',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, try to recover site!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
				title: 'Please wait',
				text: 'Trying to recover this WordPress site.',
				icon: 'warning',
				showConfirmButton: false,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			
			disableThemePlugins( $, selectedNodeId, selectedSiteId )
			.done( function(){
				location.reload();
			})
			.fail( function( err ){
				swalWithBootstrapButtons.fire({
				  text: err.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
				});
			});
			
		  }
		});
		
	});
	
	
	
	
	//dynamic onclick actionRecreateUsers starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionRecreateUsers', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Recreate users for site ID: '+selectedSiteId+' on node ID: '+selectedNodeId,
		  text: 'This option is recreate client and superduper users. Usually after importing a site. Do you want to proceed?',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, recreate users!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
				title: 'Please wait',
				text: 'Recreating users',
				icon: 'warning',
				showConfirmButton: false,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			
			recreateUsers( $, selectedNodeId, selectedSiteId )
			.done( function(){
				location.reload();
			})
			.fail( function( err ){
				swalWithBootstrapButtons.fire({
				  text: err.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
				});
			});
			
		  }
		});
		
	});
	
	
	
	
	
	
	
	//dynamic onclick actionBackupRestore starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionBackupRestore', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		//show modal popup
		$( '#modalBackupRestore' ).modal( 'show' );
		
		//update the take backup button node-id and site-id
		$( '#btnTakeSiteBackupNow' ).data( 'node-id', selectedNodeId ).data( 'site-id', selectedSiteId );
		
		var html = '';
		
		getSiteBackups( $, selectedNodeId, selectedSiteId ).done( function( apiData ){
			
			html += '<h6 class="text-center">Backup list</h6>';
			html += '<table class="table table-bordered table-hover table-sm" data-node-id="'+selectedNodeId+'" data-site-id="'+selectedSiteId+'"><thead class="table-success"><tr>';
					html += '<th scope="col">#</th>';
					html += '<th scope="col">Date [nonce]</th>';
					html += '<th scope="col">Backup Entities</th>';
					html += '<th scope="col text-center">Action</th>';
				html += '</tr></thead><tbody>';
				
				var counter = 1;
				$.each( apiData.data, function(index, record) {
					
					html += '<tr class="" data-nonce-id="'+record.nonce+'">';
						html += '<th scope="row">';
							html += counter;
						html += '</th>';
						html += '<td>'+record.job_identifier+'</td>';
						html += '<td>'+record.backup_entities+'</td>';
						html += '<td class="text-center"><a class="btn btn-primary btn-sm btnRestoreSiteBackupNow">Restore</a></td>';
					html += '</tr>';
					counter++;
				});
				
			html += '</tbody></table>';
			$( "#injectSiteBackupData" ).html( html );
			
			//inject website name
			$( '#injectTextTitleBackupRestore' ).html( 'Backups of site: <a class="text-decoration-none" href="https://'+apiData.domain+'" traget="_blank">'+apiData.domain+' <small><i class="fas fa-external-link-alt"></i></small></a>' );
			
			
			//hide the loading div
			$( '.modalLoadingDivWrapper' ).slideUp();
			
			//show injectSiteBackupData
			$( '#injectSiteBackupData' ).slideDown();
		
		})
		.fail( function( err ){
			html += '<h6 class="text-center">'+err.responseJSON.errorMsg+'</h6>';
			$( "#injectSiteBackupData" ).html( html );
			
			//hide the loading div
			$( '.modalLoadingDivWrapper' ).slideUp();
			
			//show injectSiteBackupData
			$( '#injectSiteBackupData' ).slideDown();
		});
		
		
		
	});
	//dynamic onclick actionBackupRestore ends
	
	
	
	
	
	//dynamic onclick actionUpdateSite starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on( 'click', '.actionUpdateSite', async function( e ) {
		e.preventDefault();
		
	
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
			
		
		//show modal popup
		$('#modalUpdateSite').modal('show');
		
		getSiteJson( $, selectedNodeId, selectedSiteId ).done( function( apiData ){
			var results = apiData.data[0];
			
			$( '#updateSiteSelectedNodeId' ).val( results['node-id'] );
			$( '#updateSiteSelectedSiteId' ).val( results['site_id'] );
			
			
			$( '#updateSitePhpVer' ).val( results['php_version'] ).change();
			$( '#updateSiteWpVer' ).val( results['wp_version'] ).change();
			$( '#updateSiteRestrictionGroupId' ).val( results['restrictions_group'] ).change();
			
			//inject website name
			$( '#injectTextTitleUpdateSite' ).html( 'Update site: <a class="text-decoration-none" href="https://'+results.domain+'" traget="_blank">'+results.domain+' <small><i class="fas fa-external-link-alt"></i></small></a>' );
			
			//inject user in password protectoin field:
			$( '#updatePasswordProtectionUser' ).html( 'site'+results['site_id'] );
			
			
			//hide the loading div
			$( '.modalLoadingDivWrapper' ).slideUp();
			
			//show form
			$( '#updateSiteForm' ).slideDown();
		});
		
		
		
	});
	//dynamic onclick actionUpdateSite ends

	
	
	
	
	
	
	//dynamic onclick actionRunPager starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionRunPager', function( e ) {
		e.preventDefault();
		if( $(this).hasClass('disabled') ){
			return false;
		}
		$( '#node'+selectedNodeId+'-pagination ul li a' ).each(function(index, e){
			$(e).addClass( 'disabled' );
		});
		
		var selectedNodeId = $(this).closest('div.divData').data('node-id');
		var maxPageResults = $(this).closest('div.divData').data('max-page-results');
		var showPage = $(this).data('show-page');
		var currentPageNumber = $(this).closest('div.divData').data('page-current');
		var siteCounter = 1;
		
		
		siteCounter = (showPage*maxPageResults)-(maxPageResults-1);
		
		getNodeInfo( $, selectedNodeId, maxPageResults, showPage  ).done( function( record ){
			
			var siteIdList = record['site_data'];
			
			var siteListHtml = '';
			
			$.each( siteIdList, function(index, record) {
				siteListHtml += '<tr class="node'+selectedNodeId+'site'+record['id']+'" data-node-id="'+selectedNodeId+'" data-site-id="'+record['id']+'">';
					siteListHtml += '<th scope="row">';
						siteListHtml += siteCounter;
					siteListHtml += '</th>';
				siteListHtml += '</tr>';
				
				//function get the site info
				getSiteInfo( $, selectedNodeId, record['id'], 'node'+selectedNodeId+'site'+record['id'] );
				
				siteCounter++;
			});
			var paginationHtml = buildPagination( $, selectedNodeId, record['total_sites'], record['total_pages'], record['current_page'], record['results_per_page'] );
			
			
			$([document.documentElement, document.body]).animate({
				scrollTop: $( "#node"+selectedNodeId+"-ctrl-heading" ).offset().top
			}, 500);
			

			$( "#node"+selectedNodeId+"-site-list" ).html( siteListHtml );
			$( "#node"+selectedNodeId+"-pagination" ).remove();
			$( paginationHtml ).insertAfter( "#node"+selectedNodeId+"-SiteListTable" );
			
		});
		
		
	});
	//dynamic onclick actionRunPager ends
	
	
	
	
	
	

	//dynamic onclick actionLoginAsUser starts
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionLoginAsUser', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		//show modal popup
		$('#modalLoginAsUser').modal('show');
		
		
		getSiteWithUserData( $, selectedNodeId, selectedSiteId ).done( function( apiData ){
			var results = apiData.data[0];
			
			//inject website name
			$( '#injectTextTitleLoginAsUser' ).html( 'Login as user: <a class="text-decoration-none" href="https://'+results.domain+'" target="_blank">'+results.domain+' <small><i class="fas fa-external-link-alt"></i></small></a>' );
			
			//inject users list
			var injectHtml = '';
			$.each( results['users-list'], function(index, record) {
				injectHtml += '<tr>';
				injectHtml += '<td>'+record['ID']+'</td>';
				injectHtml += '<td>'+record['user_login']+'</td>';
				injectHtml += '<td>'+record['user_email']+'</td>';
				injectHtml += '<td>'+record['display_name']+'</td>';
				injectHtml += '<td>'+record['roles']+'</td>';
				injectHtml += '<td>'+record['user_registered']+'</td>';
				injectHtml += '<td><a class="btn btn-link p-0 actionGetUserLoginLink" target="_blank" href="#" data-user-id="'+record['ID']+'" data-node-id="'+apiData.data[0]['node-id']+'" data-site-id="'+apiData.data[0]['site_id']+'"><i class="fas fa-sign-in-alt"></i></a></td>';
				injectHtml += '</tr>';
			});
			$( '#dumpHTMLHereUsersList' ).html( injectHtml );
			
			
			injectHtml = '<div class="col-6" style="border-right: 1px dotted #ccc;">';
			
				injectHtml += '<h5 class="mb-3"><i class="fas fa-upload"></i> SFTP access info</h5>';
				
				
				
				
				
			
				injectHtml += '<div class="row mb-1"><div class="col-8">';
					injectHtml += '<strong>Protocol:</strong> SFTP';
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-4">';
					injectHtml += '<strong>Port:</strong> 22';
				injectHtml += '</div></div>';
			
	
				injectHtml += '<div class="row mb-1"><div class="col-8">';
					injectHtml += '<strong>Host:</strong> ssh-app-ctrl-'+results['node-id']+'.'+ROOT_DOMAIN_NAME;
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-4">';
					injectHtml += '<strong>User:</strong> site'+results['site_id'];
				injectHtml += '</div></div>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-12">';
					injectHtml += '<strong>Password:</strong> '+results['ssh_password'];
				injectHtml += '</div></div>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-12">';
					injectHtml += '<strong>Quickconnect (FileZilla):</strong> <span class="badge bg-success"><span class="clickToCopy">';
					injectHtml += 'sftp://site'+results['site_id']+':'+results['ssh_password']+'@ssh-app-ctrl-'+results['node-id']+'.'+ROOT_DOMAIN_NAME;
					injectHtml += '</span> <i class="fas fa-copy ms-1"></i></span>';
				injectHtml += '</div></div>';
				
				
				
				
				injectHtml += '<hr />';
				
				injectHtml += '<h5 class="mb-3"><i class="fas fa-key"></i> Site Password Protection</h5>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-3">';
					injectHtml += '<strong>User:</strong> site'+results['site_id'];
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-9">';
					injectHtml += '<strong>Password:</strong> <span class="badge bg-warning text-black">Set Password from <i class="fas fa-edit"></i> edit action menu.</span>';
				injectHtml += '</div></div>';
				
				
				
				

			injectHtml += '</div>';
			
			
			
			
			injectHtml += '<div class="col-6">';
			injectHtml += '<h5 class="mb-3"><i class="fas fa-database"></i> MySQL database access info</h5>';
			
				injectHtml += '<span class="badge bg-warning text-black">Connect with MySQL database using "SSH Tunnel"</span>';
			
			
				injectHtml += '<div class="row mb-1"><div class="col-8">';
					injectHtml += '<strong>Protocol:</strong> SSH (Tunnel)';
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-4">';
					injectHtml += '<strong>Port:</strong> 22';
				injectHtml += '</div></div>';
			
	
				injectHtml += '<div class="row mb-1"><div class="col-8">';
					injectHtml += '<strong>Host:</strong> ssh-db-ctrl-'+results['node-id']+'.'+ROOT_DOMAIN_NAME;
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-4">';
					injectHtml += '<strong>User:</strong> site'+results['site_id'];
				injectHtml += '</div></div>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-12">';
					injectHtml += '<strong>Password:</strong> '+results['ssh_password'];
				injectHtml += '</div></div>';
				
				injectHtml += '<span class="badge bg-warning text-black">Database Connection Info</span>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-5">';
					injectHtml += '<strong>Host:</strong> 127.0.0.1';
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-7">';
					injectHtml += '<strong>Port:</strong> 3306';
				injectHtml += '</div></div>';
				
				
				injectHtml += '<div class="row mb-1"><div class="col-5">';
					injectHtml += '<strong>User:</strong> site'+results['site_id'];
				injectHtml += '</div>';
				
				injectHtml += '<div class="col-7">';
					injectHtml += '<strong>Password:</strong> '+results['ssh_password'];
				injectHtml += '</div></div>';
				
				
				
				
			injectHtml += '</div>';
			
			
			$( '#otherAccessInfoHtmlDumpWrapper' ).html( injectHtml );
				
			
			//hide the loading div
			$( '.modalLoadingDivWrapper' ).slideUp();
			//show the table div
			$( '#modalUserListTable' ).slideDown();
		});
		
	});
	//dynamic onclick actionLoginAsUser ends
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//dynamic onclick activate site
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionActivateSite', function( e ) {
		e.preventDefault();
		
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Do you want to activate site ID: '+selectedSiteId+' on node ID: '+selectedNodeId,
		  text: 'This will activate the site and all the background tasks will be resumed.',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, activate site!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
			  icon: "info",
			  title: "Activating site...",
			  text: "Please wait",
			  showConfirmButton: false,
			  allowOutsideClick: false,
			  timerProgressBar: true,
			  timer: 100000,
			});
			
			
			activeOrDeactiveSite( $, selectedNodeId, selectedSiteId, 'activate' )
			.done( function(){
				location.reload();
			})
			.fail( function( err ){
				swalWithBootstrapButtons.fire({
				  text: err.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
				});
			});
			
		  }
		});

	});
	
	
	
	
	//dynamic onclick deactivate site
	$( '#wrapperSiteList, #wrapperSearchSiteList' ).on("click", '.actionDeactivateSite', function( e ) {
		e.preventDefault();
		
		var selectedNodeId = $(this).closest('tr').data('node-id');
		var selectedSiteId = $(this).closest('tr').data('site-id');
		
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Do you want to disable site ID: '+selectedSiteId+' on node ID: '+selectedNodeId,
		  text: 'This will not remove the site but all the background tasks will stop working including Cron Jobs and Backups.',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, disable site!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
			  icon: "info",
			  title: "Deactivating site...",
			  text: "Please wait",
			  showConfirmButton: false,
			  allowOutsideClick: false,
			  timerProgressBar: true,
			  timer: 100000,
			});
			
			
			activeOrDeactiveSite( $, selectedNodeId, selectedSiteId, 'deactivate' )
			.done( function(){
				location.reload();
			})
			.fail( function( err ){
				swalWithBootstrapButtons.fire({
				  text: err.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
				});
			});
			
		  }
		});
		

	});

	
	
	
	//on change selector for newsite form
	$( '#newSiteCloneSourceNode' ).on('change', function( e ) {
		
		newSiteCloneSourceNodeId = $(this).val();
		
		if( newSiteCloneSourceNodeId !== '' ){
			$( '#newSiteCloneSourceSiteId' ).attr( 'disabled', false ).attr( 'placeholder', 'type to search site domain...' );
		}else{
			$( '#newSiteCloneSourceSiteId' ).attr( 'disabled', true ).attr( 'placeholder', 'first select source node to clone from' );
			$( '#injectFormBuilderWrapper' ).slideUp();
			$( '#dumpInjectHtmlHere' ).html( '&nbsp;' );
		}
	  
	  /*
	  newSiteCloneSourceNodeId = $(this).val();
	  
	  if( newSiteCloneSourceNodeId !== '' ){
		
		//show loading spinner
		$( '#cloneSourceSiteIdSpinnerIcon' ).show();
		
		var time = 0;
		var lastSiteId = allNetworkSites[newSiteCloneSourceNodeId].length;
		lastSiteId--;
		
		$.each( allNetworkSites[newSiteCloneSourceNodeId], function(index, record) {
			
			setTimeout( function(){
				
				 //function get the site info
				  getSiteInfo( $, newSiteCloneSourceNodeId, record['id'], false, '#newSiteCloneSourceSiteId' ).done( function(){
						if( index == lastSiteId ){
							$( '#newSiteCloneSourceSiteId' ).attr( 'disabled', false );
							$( '#cloneSourceSiteIdSpinnerIcon' ).hide(); //hide loading spinner
						}
				  });
		  
			}, time)
			time += 50;
			
		});
		
		
	  }else{
		  $( '#newSiteCloneSourceSiteId' ).attr( 'disabled', true ).html('<option value="">select</option>');
		  $( '#injectFormBuilderWrapper' ).slideUp();
		  $( '#dumpInjectHtmlHere' ).html( '&nbsp;' );
	  }
	  
	  */
	  
	});
	
	
	
	
	
	$( '.basicAutoComplete' ).autoComplete({
		minLength: 3,
		bootstrapVersion: '4',
		resolver: 'custom',
		preventEnter: true,
		
		formatResult: function (item) {
			return {
				value: item.site_id,
				text: "[" + item.site_id + "] " + item.domain,
			};
		},
		resolver: 'custom',
		events: {
			search: function (qry, callback) {
				paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':newSiteCloneSourceNodeId, 'domain':qry };
				return $.ajax({
					method: 'post',
					url:'//ctrl-'+newSiteCloneSourceNodeId+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
					data:paramters
				}).done(function( results ) {
					console.log( results.data );
					callback( results.data )
				});
			}
		}
	});
	
	
	$( '.basicAutoComplete ').on( 'autocomplete.select', function (evt, item) {
		if( item ){
			$( '#cloneSourceSiteIdSpinnerIcon' ).show();
			getSiteInfo( $, newSiteCloneSourceNodeId, item.site_id, false, '#injectFormBuilderWrapper' );
		}else{
			$( '#cloneSourceSiteIdSpinnerIcon' ).hide();
			$('#injectFormBuilderWrapper').slideUp();
			$('#dumpInjectHtmlHere').html( '&nbsp;' );
		}
	});
	
	
	
	
	
	
	
	
	//on newSiteForm submit
	$( '#newSiteForm' ).submit(function( e ){
		e.preventDefault();
		newSiteFormSubmit( $ );
	});
	
	
	
	
	
});