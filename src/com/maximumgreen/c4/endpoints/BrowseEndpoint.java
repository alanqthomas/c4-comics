package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.BrowseSearch;
import com.maximumgreen.c4.PMF;
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


@Api(name = "browseendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class BrowseEndpoint {
		
	@ApiMethod(name = "getResults")
	public BrowseSearch getResults(BrowseSearch search) throws BadRequestException {
		
		if (search.getNumResults() == 0)
			throw new BadRequestException("num results is 0");
		
		if (search.getSearchIds() == null)
			throw new BadRequestException("search id list is null");
		
		if (search.getSearchIds().get(0) == null)
			throw new BadRequestException("get(0) is null");
		
		PersistenceManager mgr = null;
		Long fetch;
				
		try {
			mgr = getPersistenceManager();
			//Use the first tag from the list to get all comics with that tag
			fetch = search.getSearchIds().get(0);
			Tag t = mgr.getObjectById(Tag.class, fetch);
			search.setResults(t.getComicsWithTag());
			
			//If the comics in the result list do not have one of the remaining tags, remove them from the list
			for (int i = 1; i < search.getResults().size(); i++){
				fetch = search.getSearchIds().get(i);
				t = mgr.getObjectById(Tag.class, fetch);
				for (Long id : search.getResults()){
					if (!t.getComicsWithTag().contains(id))
						search.getResults().remove(id);
				}
			}
			//Check if we should return the comics or more tags
			if (search.getResults().size() <= search.getNumResults()){
				search.setComics(true);
				return search;
			}
			//Change the results to be relevant tags to narrow down search
			else {
				//Now check the resulting comics for tags not in the passed in tags list and add them
				List<Long> temp = new ArrayList<Long>();
				for (Long id : search.getResults()) {
					Comic c = mgr.getObjectById(Comic.class, id);
					for (Long tagId : c.getTags()){
						if (!search.getSearchIds().contains(tagId)) {
							temp.add(tagId);
						}
					}
				}
				//set the tags as as the result
				search.setComics(false);
				search.setResults(temp);
				return search;
			}
				
		} finally {
			mgr.close();
		}
		
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
