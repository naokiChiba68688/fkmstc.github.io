// special playlist post processing function
function process(playlist) {
    return playlist;
}

class pLoader extends Hls.DefaultConfig.loader {

    constructor(config) {
        super(config);
        var load = this.load.bind(this);
        this.load = function(context, config, callbacks) {
            if (context.type == 'manifest') {
                var onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function(response, stats, context) {
                    response.data = process(response.data);
                    onSuccess(response, stats, context);
                }
            }
            load(context, config, callbacks);
        };
    }
}

var hls = new Hls({
    pLoader: pLoader,
});