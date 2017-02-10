var express=require('express');
var fs=require('fs');
var request=require('request');
var cheerio=require('cheerio');
var app= express();
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/views", express.static( __dirname + '/views'));


//The next step was to part in two modules, one for le bon coin and the other for meilleurs agents.

app.get('/',function(req,res){ 
	res.render('test.ejs');
	
})
app.post('/result',function(req,res){	
	
	
	url2='https://www.meilleursagents.com/prix-immobilier/'
	var url = req.body.testurl;
	
	request(url,function(error,response,html){ 
		
		if(!error){
			
			
			var $= cheerio.load(html);
			
			var price, city, type, surface;
			
			
			var price= $("#adview > section > section > section.properties.lineNegative > div:nth-child(5) > h2 > span.value").text().trim();
			var city= $("#adview > section > section > section.properties.lineNegative > div.line.line_city > h2 > span.value").text();
			var type= $("#adview > section > section > section.properties.lineNegative > div:nth-child(8) > h2 > span.value").text();
			var surface= $("#adview > section > section > section.properties.lineNegative > div:nth-child(10) > h2 > span.value").text();
			
			
			
			
		}
		else{
			console.log("error");
		}
		
		urlextension = city.replace(' ','-');
		urlextension=urlextension.replace('\'','-')
		urlextension=urlextension.toLowerCase();
	
		
		url2=url2+urlextension.trim()+"/";
		request(url2,function(error2,response2,html2){
			
			if(!error2){
				var $2 = cheerio.load(html2);
				var pricem2low='';
				var pricem2medium='';
				var pricem2high='';
			
				if (type=="Maison")
				{
					pricem2low= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted");
					pricem2medium= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median");
					pricem2high= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div:nth-child(4)");
					
				}
				else if (type=="Appartement")
				{
					pricem2low= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted");
					pricem2medium= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median");
					pricem2high= $2("#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div:nth-child(4)");
					
				}
			}
			else{
				console.log("error");
			}
			pricem2low=parseInt(pricem2low.text().replace('€','').trim().replace(/\s/g,""));
			pricem2medium=parseInt(pricem2medium.text().replace('€','').trim().replace(/\s/g,""));
			pricem2high=parseInt(pricem2high.text().replace('€','').trim().replace(/\s/g,""));
			
			surface=parseInt(surface.replace('m2','').trim().replace(/\s/g,""));
			price=parseInt(price.replace('€','').trim().replace(/\s/g,""));
			var estimatedpricelow=surface*pricem2low;
			var estimatedpricemedium=surface*pricem2medium;
			var estimatedpricehigh=surface*pricem2high;
			if(price<=estimatedpricelow)
			{
				res.render('result.ejs',{reponse: "a VERY GOOD DEAL"});
			}
			else if(price<=estimatedpricemedium)
			{
				res.render('result.ejs',{reponse: "a GOOD DEAL"});
			}
			else if(price<=estimatedpricehigh)
			{
				res.render('result.ejs',{reponse: "CORRECT"});
			}
			else{
				res.render('result.ejs',{reponse: "a BAD DEAL"});
			}
			
			
		})
		
	})
	
	
})


app.listen('8081')

exports=module.exports=app;