class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;

    };
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            },
        }:
        {};
        
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryStr };
        // * Removing some fields for CATEGORY     *****     Jan,31 - 05:29 //
        // console.log(queryCopy);
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach(key=>delete queryCopy[key]);

        // * Filter for Price and Rating     *****     Jan,31 - 05:42 //
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`); //greater than | lesser than | equal to
        

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage*(currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }

};

module.exports = ApiFeatures