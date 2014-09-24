$( document ).ready(function() {
    
    var loginView, statusView, contentView, config;
    
    squid_api.setup({
        "apiUrl" : "api.squidsolutions.com",
        "clientId" : "local",
        "projectId" : "squidflow",
        "domainId" : "usage",
        "selection" : null
    });

    var analysis = new squid_api.controller.analysisjob.AnalysisModel();
    analysis.setDimensionIds(["origin", "step0","step1","step2"]);
    analysis.setMetricIds(["count", "searches"]);
    
    /*
     * Declare the views 
     */
     
    loginView = new squid_api.view.LoginView({
        el : '#login',
        autoShow : false
    });
    
    statusView = new squid_api.view.StatusView({
        el : '#status'
    });

    /*
    new squid_api.view.DataTableView({
    	el : "#main-content",
    	model : analysis
    })
    */
    
    new squid_api.view.PeriodSelectionView({
        el : '#date',
        datePickerEl : $('#picker')
    });
    
    new squid_api.view.FiltersSelectionView({
    	el : '#selection',
    	filtersEl : $('#filters')
    });

    new squid_api.view.DimensionSelector({
        el : '#origin',
        model : analysis
    });
    
    new squid_api.view.FlowChartView({
        el : '#main-content',
        model : analysis
    });
    
    /*
     * Controller part
     */
    
    squid_api.model.status.on('change', function(model){
        // performed when the global status changes
        if (model.get("status") == model.STATUS_DONE) {
            $("#main").removeClass("hidden");
        }
    });
    
    squid_api.model.project.on('change', function() {
    	squid_api.controller.analysisjob.compute(analysis);
    });
    
    squid_api.model.filters.on('change:selection', function() {
    	squid_api.controller.analysisjob.compute(analysis); 
    });

    // check for analysis origin update
    analysis.on('change:dimensions', function() {
        squid_api.controller.analysisjob.compute(analysis);
    });
    
    /*
     * Start the App
     */
    squid_api.init();
});
