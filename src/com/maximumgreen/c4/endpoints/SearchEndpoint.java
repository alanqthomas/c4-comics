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
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.SearchBaseException;
import com.google.appengine.api.search.SearchException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@SuppressWarnings("unchecked")
@Api(name = "searchendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class SearchEndpoint {
	
	private static final Logger log = Logger.getLogger(SearchEndpoint.class.getName());
		
	@ApiMethod(name = "getResults", httpMethod = "POST")
	public SearchHelper getResults(SearchHelper search) throws BadRequestException, NotFoundException {
			
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
		
		Set<String> userIds = new LinkedHashSet<String>();
		Set<String> seriesIds = new LinkedHashSet<String>();
		Set<String> comicIds = new LinkedHashSet<String>();
		
		try{
			Collection<ScoredDocument> docs = userIndex.search(query).getResults();
			for(ScoredDocument doc : docs){
				Iterable<Field> fields = doc.getFields("id");
				for(Field f : fields){
					userIds.add(f.getText());
				}
			}
		} catch (SearchException e){
			log.severe("Search error: user");
		}
		
		try{
			Collection<ScoredDocument> docs = seriesIndex.search(query).getResults();
			for(ScoredDocument doc : docs){
				Iterable<Field> fields = doc.getFields("id");
				for(Field f : fields){
					seriesIds.add(f.getText());
				}
			}
		} catch(SearchException e){
			log.severe("Search Error: series");
		}
		
		try{
			Collection<ScoredDocument> docs = comicIndex.search(query).getResults();
			for(ScoredDocument doc : docs){
				Iterable<Field> fields = doc.getFields("id");
				for(Field f : fields){
					comicIds.add(f.getText());
				}
			}
		} catch(SearchException e){
			log.severe("Search error: comic");
		}		
		
		log.info("userIds: " + userIds.toString());
		log.info("seriesIds: " + seriesIds.toString());
		log.info("comicIds: " + comicIds.toString());
		
		ArrayList userList = new ArrayList();
		ArrayList seriesList = new ArrayList();
		ArrayList comicList = new ArrayList();
		
		try{
			mgr = getPersistenceManager();
			for(String s: userIds){
				C4User user = mgr.getObjectById(C4User.class, s);
				userList.add(user);					
			}
			log.info("user list: " + userList.toString());
			search.setAuthorResults(userList);

			
			for(String s: seriesIds){
				Series series= mgr.getObjectById(Series.class, Long.decode(s));
				seriesList.add(series);				
			}
			log.info("series list: " + seriesList.toString());
			search.setSeriesResults(seriesList);
		
			for(String s: comicIds){
				Comic comic = mgr.getObjectById(Comic.class, Long.decode(s));
				comicList.add(comic);				
			}
			log.info("comic list: " + comicList.toString());
			search.setComicResults(comicList);
		} catch (javax.jdo.JDOObjectNotFoundException e){
			throw new NotFoundException("Could not find entity");
		} finally {
			mgr.close();
		}
		
		log.info("search.user: " + search.getAuthorResults().toString());
		log.info("search.series: " + search.getSeriesResults().toString());
		log.info("search.comic: " + search.getComicResults().toString());
				
		return search;
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}