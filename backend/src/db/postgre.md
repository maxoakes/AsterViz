# PostreSQL to this DB conversion
```
select 
	id, full_name, pdes, fancy_name, neo, pha, absmag,
	diameter, albedo, eccentricity, semimajor_axis, perihelion,
	inclination, asc_node_long, arg_periapsis, mean_anomaly,
	classid from asteroids 
where diameter is not null order by diameter desc limit 25000
```
save as CSV