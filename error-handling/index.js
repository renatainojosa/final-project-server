const handleError = (app) => {
    app.use((req, res, next) => {
        req.status(404).json('Não encontrado!');
    })

    app.use((error, req, res, next) => {
        console.log('ERRO!', req.method, req.path, error);
        
        if(!res.headersSent) {
            res.status(500).json({
                message: error.message || 'Erro interno no servidor',
                error
            });
        };
    })
}

module.exports = handleError;