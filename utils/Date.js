const getDate=function(){
    let date = new Date();
    return date.toLocaleDateString()+" "+date.toLocaleTimeString()
}

module.exports=getDate