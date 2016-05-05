package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.Comment;
import com.maximumgreen.c4.Notification;
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
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.maximumgreen.c4.endpoints.IndexService;

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
	 * @throws NotFoundException 
	 */
	@ApiMethod(name = "insertSeries")
	public Series insertSeries(Series series) throws BadRequestException, NotFoundException {
		if (series.getTitle() == null){
			series.setTitle("New Series");
		}
		if (series.getAuthorId() == null)
			throw new BadRequestException("Author missing.");
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (series.getId() != null) {
				if (containsSeries(series)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			//set the date and date string to the date of creation (now)
			Date now = Calendar.getInstance().getTime();
			series.setDateCreated(now);
			series.setDateString(formatDate(now));

			mgr.makePersistent(series);
			index(series);
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
			if (series.getCssTitleColor() != null)
				updatedSeries.setCssTitleColor(series.getCssTitleColor());
			if (series.getCssHeadingColor() != null)
				updatedSeries.setCssHeadingColor(series.getCssHeadingColor());
			if (series.getCssDescriptionColor() != null)
				updatedSeries.setCssDescriptionColor(series.getCssDescriptionColor());
			if (series.getCssBGColor() != null)
				updatedSeries.setCssBGColor(series.getCssBGColor());
			if (series.getComicTitleColor() != null)
				updatedSeries.setComicTitleColor(series.getComicTitleColor());
			if (series.getComicTitleBGColor() != null)
				updatedSeries.setComicTitleBGColor(series.getComicTitleBGColor());
			if (series.getCssComicBGColor() != null)
				updatedSeries.setCssComicBGColor(series.getCssComicBGColor());
			
			mgr.makePersistent(updatedSeries);
			index(updatedSeries);
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
			IndexService.removeDocument(IndexService.SERIES, id.toString());
		}
	}

	//CUSTOM METHODS
	@ApiMethod(name="addseriescomic")
	public Series addSeriesComic(@Named("seriesId") Long seriesId, @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		Comic comic;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			user = mgr.getObjectById(C4User.class, series.getAuthorId());
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (series.getComics() == null){
				List<Long> list = new ArrayList<Long>();
				series.setComics(list);
			}
			
			series.addSeriesComic(comicId);
			notifySubscribers(user, series, comic);
			
			mgr.makePersistent(series);
			index(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
		
		return series;
	}
	
	@ApiMethod(name="deleteseriescomic")
	public Series deleteSeriesComic(@Named("seriesId") Long seriesId, @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Series series;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			series.deleteSeriesComic(comicId);
			
			mgr.makePersistent(series);
			index(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id invalid.");
		} finally {
			mgr.close();
		}
		
		return series;
	}
	
	@ApiMethod(name="addSeriesComment")
	public Series addSeriesComment(@Named("userId") String userId, @Named("seriesId") Long seriesId, @Named("comment") String comment)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		Comment newComment = buildComment(userId, comment);
				
		try {
			user = mgr.getObjectById(C4User.class, userId);
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (series.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				series.setComments(list);
			}
			if (user.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				user.setComments(list);
			}
			
			series.addSeriesComment(newComment.getId());
			user.addUserComment(newComment.getId());
			
			mgr.makePersistent(series);
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id or User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return series;
	}
	
	@ApiMethod(name="deleteSeriesComment")
	public Series deleteSeriesComment(@Named("userId") String userId, @Named("seriesId") Long seriesId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		Comment comment;
		
		try {
			series = mgr.getObjectById(Series.class, seriesId);
			series.deleteSeriesComment(commentId);
			mgr.makePersistent(series);
			
			user = mgr.getObjectById(C4User.class, userId);
			user.deleteUserComment(commentId);
			mgr.makePersistent(user);
			
			comment = mgr.getObjectById(Comment.class, commentId);
			mgr.deletePersistent(comment);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series Id or User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return series;
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

	private String formatDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
		return formatter.format(date);
	}
	
	private String formatCommentDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy hh:mm:ss");
		return formatter.format(date);
	}
	
	public static void index(Series series) throws NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		C4User user;
		
		try{
			user = mgr.getObjectById(C4User.class, series.getAuthorId());
		} catch (javax.jdo.JDOObjectNotFoundException e){
			throw new NotFoundException("User does not exist");
		} finally {
			mgr.close();
		}
		
		// Index newly created series
		Document doc = Document.newBuilder()
				.setId(series.getId().toString())
				.addField(Field.newBuilder().setName("id").setText(series.getId().toString()))
				.addField(Field.newBuilder().setName("title").setText(series.getTitle()))
				.addField(Field.newBuilder().setName("author").setText(user.getUsername()))
				.addField(Field.newBuilder().setName("description").setText(series.getDescription()))
				.build();
		IndexService.indexDocument(IndexService.SERIES, doc);
		
		mgr = getPersistenceManager();
		if(series.getComics() != null){
			for(Long id : series.getComics()){
				Comic comic = mgr.getObjectById(Comic.class, id);
				try {
					ComicEndpoint.index(comic);
				} catch (NotFoundException e) {
					e.printStackTrace();
				}			
			}
		}
		mgr.close();
	}
	
	private void notifySubscribers(C4User user, Series series, Comic comic){
		//check if the series has subscribers first
		if (series.getSubscribers() != null){
			PersistenceManager mgr = getPersistenceManager();
			Notification notification;
			//first check to see if this notification exists already
			try {
				notification = mgr.getObjectById(Notification.class, comic.getId());
			} catch (javax.jdo.JDOObjectNotFoundException ex) {
				notification = new Notification();
				String message = user.getUsername() + " has added a new comic titled " + comic.getTitle()
						+ " to " + series.getTitle();
				notification.setId(comic.getId());
				notification.setType("comic");
				notification.setMessage(message);
				mgr.makePersistent(notification);
			}
			//notify the subscribers and save
			for (String subscriberId : series.getSubscribers()){
				C4User subscriber = mgr.getObjectById(C4User.class, subscriberId);
				if (subscriber.getNotifications() == null){
					List<Long> list = new ArrayList<Long>();
					subscriber.setNotifications(list);
				}
				if (!subscriber.getNotifications().contains(notification.getId())){
					subscriber.addNotification(notification.getId());
					mgr.makePersistent(subscriber);
				}
			}
			
			mgr.close();
		}

	}
	
	private Comment buildComment(String userId, String comment) throws NotFoundException{
		PersistenceManager mgr = getPersistenceManager();

		try {
			Comment newComment = new Comment();
			String username = mgr.getObjectById(C4User.class, userId).getUsername();
			newComment.setUserId(userId);
			newComment.setUsername(username);
			newComment.setComment(comment);
			Date now = Calendar.getInstance().getTime();
			newComment.setDate(now);
			newComment.setDateString(formatCommentDate(now));
			mgr.makePersistent(newComment);
			return newComment;
		} catch (javax.jdo.JDOObjectNotFoundException e) {
			throw new NotFoundException("User ID doesn't exist");
		} finally {
			mgr.close();
		}
	}
}
