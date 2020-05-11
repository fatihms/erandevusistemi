module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Lütfen önce giriş yapınız')
        res.redirect('/doctor/login')
    }
} 