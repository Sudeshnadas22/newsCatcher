import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from '../Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
   static defaultProps={
    country:'in',
    pageSize:11,
    category: 'general'
   }
   static PropTypes={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
   }
   capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase()+ string.slice(1);
   }
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page:1
        }
        document.title= `${this.capitalizeFirstLetter(this.props.category)} - NewsCtacher`;
    }
    async componentDidMount(){
    this.props.setProgress(10)
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
        let data= await fetch(url);
    this.props.setProgress(30)
        let parsedData= await data.json()
    this.props.setProgress(70)
        this.setState({articles:parsedData.articles, totalResults:parsedData.totalResults,
            loading:false })
    this.props.setProgress(100)

    }

    handlePrevClick=async()=>{
        this.props.setProgress(10)
    let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data= await fetch(url);
    this.props.setProgress(30)
    let parsedData= await data.json()
    this.props.setProgress(70)
    console.log(parsedData);
    this.setState({
        page: this.state.page-1,
       articles:parsedData.articles,
       loading:false,
    })
    this.props.setProgress(100)

}

handleNextClick = async ()=>{
    this.props.setProgress(10)
    if(!(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize))){
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true})
        let data= await fetch(url);
    this.props.setProgress(30)
        let parsedData= await data.json()
    this.props.setProgress(70)
        this.setState({
            page: this.state.page+1,
           articles:parsedData.articles,
           loading:false
        })
       this.props.setProgress(100)

    }
}



    render() {
        return (
            <div className='container my-3'>
                <h1 className="text-center" style={{margin: "35px 0px"}}>NewsCatcher - Top HeadLines from {this.capitalizeFirstLetter(this.props.category)}</h1>
                {this.state.loading && <Spinner/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element) => {
                     return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage}newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                    })}
                </div>
                <div className="container d-flex justify-content-between">
                <button disabled={this.state.page<=1}type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News
