$( document ).ready(function() {
    
    var api = squid_api, loginView, statusView, contentView, config;
    
    api.setup({
        "apiUrl" : "api.squidsolutions.com",
        "clientId" : "local",
        "projectId" : "squidflow_demo",
        "domainId" : "usage",
        "selection" : null
    });

    var analysis = new api.model.AnalysisJob();
    analysis.setDimensionIds(["origin", "step0","step1","step2"]);
    analysis.setMetricIds(["count", "withFTA"]);
    
    /*
     * Declare the views 
     */
     
    loginView = new api.view.LoginView({
        el : '#login',
        autoShow : false
    });
    
    statusView = new api.view.StatusView({
        el : '#status'
    });

    /*
    new api.view.DataTableView({
    	el : "#main-content",
    	model : analysis
    })
    */
    
    new api.view.PeriodSelectionView({
        el : '#date',
        datePickerEl : $('#picker')
    });
    
    new api.view.FiltersSelectionView({
    	el : '#selection',
    	filtersEl : $('#filters')
    });

    new api.view.DimensionSelector({
        el : '#origin',
        model : analysis
    });
    
    new api.view.FlowChartView({
        el : '#main-content',
        model : analysis
    });
    
    /*
     * Controller part
     */
    
    api.model.status.on('change', function(model){
        // performed when the global status changes
        if (model.get("status") == model.STATUS_DONE) {
            $("#main").removeClass("hidden");
        }
    });
    
    api.model.project.on('change', function() {
    	api.compute(analysis);
    });
    
    api.model.filters.on('change:selection', function() {
    	api.compute(analysis); 
    });

    // check for analysis origin update
    analysis.on('change:dimensions', function() {
        api.compute(analysis);
    });
    
    /*
     * Start the App
     */
    api.init();
});
