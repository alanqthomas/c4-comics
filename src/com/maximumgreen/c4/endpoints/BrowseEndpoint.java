package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.Tag;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;

import java.util.List;
import java.lang.Long;

import javax.inject.Named;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;

@Api(name = "browseendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class BrowseEndpoint {
		
	@ApiMethod(name = "listResults")
	//
	public List<Long> listResults(@Named("tags") List<Long> tags,  @Named("results") int numResults)
		throws BadRequestException {
		PersistenceManager mgr = null;
		List<Long> results = null;
		
		try {
			mgr = getPersistenceManager();
			//Use the first tag from the list to get all comics with that tag
			Tag t = mgr.getObjectById(Tag.class, tags.get(0));
			results = t.getComicsWithTag();
			
			//If the comics in the result list do not have one of the remaining tags, remove them from the list
			for (int i = 1; i < tags.size(); i++){
				t = mgr.getObjectById(Tag.class, tags.get(i));
				for (Long id : results){
					if (!t.getComicsWithTag().contains(id))
						results.remove(id);
				}
			}
			
		} finally {
			mgr.close();
		}
		if (results.size() <= numResults)
			return results;
		else
			throw new BadRequestException("Call the other method.");
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
