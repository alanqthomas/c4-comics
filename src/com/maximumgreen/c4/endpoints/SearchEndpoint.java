package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.SearchHelper;
import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Series;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.Tag;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;

import java.util.ArrayList;
import java.util.List;
import java.lang.Long;

import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;


@Api(name = "searchendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class SearchEndpoint {
		
	@ApiMethod(name = "getResults", httpMethod = "POST")
	public SearchHelper getResults(SearchHelper search) throws BadRequestException {
		
		if (search.getInput() == null)
			throw new BadRequestException("Search input cannot be null.");
		
		if (search.getInput().equals(""))
			return search;

		PersistenceManager mgr = null;
		String input = search.getInput();

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
		
		return search;
		
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}