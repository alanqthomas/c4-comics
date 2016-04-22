package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.SearchHelper;
import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Series;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.Tag;
import com.maximumgreen.c4.endpoints.IndexService;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;

import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.SearchBaseException;
import com.google.appengine.api.search.SearchException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@SuppressWarnings("unchecked")
@Api(name = "searchendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class SearchEndpoint {
		
	@ApiMethod(name = "getResults", httpMethod = "POST")
	public SearchHelper getResults(SearchHelper search) throws BadRequestException {
		
		Logger log = Logger.getLogger(SearchEndpoint.class.getName());
		
		log.info(search.getInput());
		
		if (search.getInput() == null)
			throw new BadRequestException("Search input cannot be null.");
		
		if (search.getInput().equals(""))
			return search;

		PersistenceManager mgr = null;
		String query = search.getInput();
		
		
		IndexSpec userIndexSpec = IndexSpec.newBuilder().setName(IndexService.USER).build();
		Index userIndex = SearchServiceFactory.getSearchService().getIndex(userIndexSpec);
		
		IndexSpec seriesIndexSpec = IndexSpec.newBuilder().setName(IndexService.SERIES).build();
		Index seriesIndex = SearchServiceFactory.getSearchService().getIndex(seriesIndexSpec);
		
		IndexSpec comicIndexSpec = IndexSpec.newBuilder().setName(IndexService.COMIC).build();
		Index comicIndex = SearchServiceFactory.getSearchService().getIndex(comicIndexSpec);
		
		IndexSpec tagIndexSpec = IndexSpec.newBuilder().setName(IndexService.TAG).build();
		Index tagIndex = SearchServiceFactory.getSearchService().getIndex(tagIndexSpec);
		
		Collection<ScoredDocument> userDocs = null;
		
		try{
			Results<ScoredDocument> result = userIndex.search(query);
			userDocs = result.getResults();
			log.info("Docs:" + userDocs.toString());
		} catch (SearchException e){
			log.warning("Search error");
		}
		
		for(ScoredDocument doc : userDocs){
			log.info("Doc: " + doc.toString());
			Iterable<Field> fields = doc.getFields("id");
			log.info("Fields: " + fields.toString());
			for(Field f : fields){
				log.info("id: " + f.getText());
			}
		}
		
		
		 
		/*
		try {
			mgr = getPersistenceManager();
			Query q = mgr.newQuery(C4User.class);
			q.setFilter("username == usernameParam");
			q.declareParameters("String usernameParam");
			List<C4User> authorResults = (List<C4User>) q.execute(input);
			if (!authorResults.isEmpty()) {
				List<C4User> newlist = new ArrayList<C4User>();
				
				for (C4User u : authorResults)
					newlist.add(u);
				
				search.setAuthorResults(newlist);
			}
			
			q = mgr.newQuery(Series.class);
			q.setFilter("title == titleParam");
			q.declareParameters("String titleParam");
			List<Series> seriesResults = (List<Series>) q.execute(input);
			if (!seriesResults.isEmpty()){
				List<Series> newlist = new ArrayList<Series>();
				
				for (Series s : seriesResults)
					newlist.add(s);
				
				search.setSeriesResults(newlist);
			}
			
			q = mgr.newQuery(Comic.class);
			q.setFilter("title == titleParam");
			q.declareParameters("String titleParam");
			List<Comic> comicResults = (List<Comic>) q.execute(input);
			if (!comicResults.isEmpty()){
				List<Comic> newlist = new ArrayList<Comic>();
				
				for (Comic c : comicResults)
					newlist.add(c);
				
				search.setComicResults(newlist);
			}
			
			q = mgr.newQuery(Tag.class);
			q.setFilter("name == nameParam");
			q.declareParameters("String nameParam");
			List<Tag> tagResults = (List<Tag>) q.execute(input);
			if (!tagResults.isEmpty()){
				List<Tag> newlist = new ArrayList<Tag>();
				
				for (Tag t : tagResults)
					newlist.add(t);
				
				search.setTagResults(newlist);
			}
	
		} finally {
			mgr.close();
		}
		*/
		
		return search;
		
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}