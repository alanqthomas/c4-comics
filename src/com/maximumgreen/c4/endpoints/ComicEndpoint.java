package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Page;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "comicendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class ComicEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listComic")
	public CollectionResponse<Comic> listComic(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Comic> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Comic.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Comic>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Comic obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Comic> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getComic")
	public Comic getComic(@Named("id") Long id) throws BadRequestException, NotFoundException {
		if (id == null)
			throw new BadRequestException("Comic ID must be specified");
		
		PersistenceManager mgr = getPersistenceManager();
		Comic comic = null;
		try {
			comic = mgr.getObjectById(Comic.class, id);
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic ID doesn't exist");
		} finally {
			mgr.close();
		}
		return comic;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param comic the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertComic")
	public Comic insertComic(Comic comic) throws BadRequestException {
		if (comic.getTitle() == null || comic.getSeriesId() == null) {
			throw new BadRequestException("Title or seriesId field missing");
		}
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (comic.getId() != null){
				if (containsComic(comic)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			//set the date and date string to the date of creation (now)
			Date now = Calendar.getInstance().getTime();
			comic.setDateCreated(now);
			comic.setDateString(formatDate(now));
			
			mgr.makePersistent(comic);
		} finally {
			mgr.close();
		}
		return comic;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param comic the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateComic")
	public Comic updateComic(Comic comic) throws BadRequestException, NotFoundException {
		if (comic.getId() == null)
			throw new BadRequestException("Comic ID can not be null");
		PersistenceManager mgr = getPersistenceManager();
		Comic updatedComic;
		try {
			//get the comic to update from the datastore
			updatedComic = getComic(comic.getId());
			//update the provided fields
			if (comic.getAuthorId() != null)
				updatedComic.setAuthorId(comic.getAuthorId());
			if (comic.getSeriesId() != null)
				updatedComic.setSeriesId(comic.getSeriesId());
			if (comic.getTitle() != null)
				updatedComic.setTitle(comic.getTitle());
			if (comic.getDateCreated() != null)
				updatedComic.setDateCreated(comic.getDateCreated());
			
			mgr.makePersistent(updatedComic);
		} catch (NotFoundException ex) {
			throw ex;
		} finally {
			mgr.close();
		}
		return updatedComic;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeComic")
	public void removeComic(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Comic comic = mgr.getObjectById(Comic.class, id);
			mgr.deletePersistent(comic);
		} finally {
			mgr.close();
		}
	}
	
	//CUSTOM METHODS
	@ApiMethod(name="addcomicpage")
	// @Named("pageId") Long pageId
	public Page addComicPage(@Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		Page page = new Page();
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getPages() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setPages(list);
			}
			
			mgr.makePersistent(page);
			
			comic.addComicPage(page.getId());
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return page;
	}
	
	@ApiMethod(name="deletecomicpage")
	public Comic deleteComicPage(@Named("comicId") Long comicId, @Named("pageId") Long pageId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			comic.deleteComicPage(pageId);
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="addcomictag")
	public Comic addComicTag(@Named("comicId") Long comicId, @Named("tagId") Long tagId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getTags() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setPages(list);
			}
			
			comic.addComicTag(tagId);
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="deletecomictag")
	public Comic deleteComicTag(@Named("comicId") Long comicId, @Named("pageId") Long tagId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			comic.deleteComicTag(tagId);
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="addcomiccomment")
	public Comic addComicComment(@Named("comicId") Long comicId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setComments(list);
			}
			
			comic.addComicComment(commentId);
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="deletecomiccomment")
	public Comic deleteComicComment(@Named("comicId") Long comicId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			comic.deleteComicComment(commentId);
			
			mgr.makePersistent(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	private boolean containsComic(Comic comic) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Comic.class, comic.getId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}
	
	private String formatDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
		return formatter.format(date);
	}

}
