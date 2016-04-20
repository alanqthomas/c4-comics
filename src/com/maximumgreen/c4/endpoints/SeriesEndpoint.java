package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Series;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "seriesendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class SeriesEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listSeries")
	public CollectionResponse<Series> listSeries(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Series> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Series.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Series>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Series obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Series> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getSeries")
	public Series getSeries(@Named("id") Long id) throws BadRequestException, NotFoundException {
		if (id == null)
			throw new BadRequestException("User ID must be specified");
		
		PersistenceManager mgr = getPersistenceManager();
		Series series = null;
		try {
			series = mgr.getObjectById(Series.class, id);
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Invalid Series ID");
		} finally {
			mgr.close();
		}
		return series;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param series the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertSeries")
	public Series insertSeries(Series series) throws BadRequestException {
		if (series.getAuthorId() == null)
			throw new BadRequestException("Author missing.");
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (series.getId() != null) {
				if (containsSeries(series)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			mgr.makePersistent(series);
		} finally {
			mgr.close();
		}
		return series;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param series the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateSeries")
	public Series updateSeries(Series series) throws BadRequestException, NotFoundException {
		if (series.getId() == null)
			throw new BadRequestException("Series ID can not be null");
		PersistenceManager mgr = getPersistenceManager();
		Series updatedSeries;
		try {
			//get the series to update from the datastore
			updatedSeries = getSeries(series.getId());
			//update the provided fields
			if (series.getAuthorId() != null)
				updatedSeries.setAuthorId(series.getAuthorId());
			if (series.getTitle() != null)
				updatedSeries.setTitle(series.getTitle());
			if (series.getDescription() != null)
				updatedSeries.setDescription(series.getDescription());
			if (series.getBgImageURL() != null)
				updatedSeries.setBgImageURL(series.getBgImageURL());
			if (series.getDateCreated() != null)
				updatedSeries.setDateCreated(series.getDateCreated());
			if (series.getRating() != 0 && (series.getRating() != updatedSeries.getRating()))
				updatedSeries.setRating(series.getRating());
			
			mgr.makePersistent(updatedSeries);
		} finally {
			mgr.close();
		}
		return updatedSeries;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeSeries")
	public void removeSeries(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Series series = mgr.getObjectById(Series.class, id);
			mgr.deletePersistent(series);
		} finally {
			mgr.close();
		}
	}

	//CUSTOM METHODS
	@ApiMethod(name="addseriescomic")
	public void addSeriesComic(@Named("seriesId") Long seriesId, @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Series series;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (series.getComics() == null){
				List<Long> list = new ArrayList<Long>();
				series.setComics(list);
			}
			
			series.addSeriesComic(comicId);
			
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
	}
	
	@ApiMethod(name="deleteseriescomic")
	public void deleteSeriesComic(@Named("seriesId") Long seriesId, @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Series series;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			series.deleteSeriesComic(comicId);
			
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
	}
	
	@ApiMethod(name="addseriescomment")
	public void addSeriesComment(@Named("seriesId") Long seriesId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Series series;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (series.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				series.setComments(list);
			}
			
			series.addSeriesComment(commentId);
			
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
	}
	
	@ApiMethod(name="deleteseriescomment")
	public void deleteSeriesComment(@Named("seriesId") Long seriesId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Series series;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			series.deleteSeriesComment(commentId);
			
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
	}
	
	private boolean containsSeries(Series series) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Series.class, series.getId());
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

}
