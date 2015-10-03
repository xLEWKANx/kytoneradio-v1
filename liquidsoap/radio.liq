#!/usr/bin/liquidsoap

garbage_collect()

out = output.icecast(

  host = "central-srv.p-s.org.ua",
  port = 15002,

  user = "source",
  password = "kytone",

  name = "Kytone",
  genre = "house/techno",

  url = "http://kytoneradio.com/",

  encoding = "UTF-8",
)

# enable telnet server
set("server.telnet.bind_addr", "127.0.0.1")
set("server.telnet", true)

# work directories
work_dir = "D:\projects\kytoneradio"
music_day_dir = "#{work_dir}/music/day"
music_night_dir = "#{work_dir}/music/night"
stable_dir = "#{work_dir}/music/stable"
jingles_dir = "#{work_dir}/jingles"

# enable unix sockets
#set("server.socket",true)
#set("server.socket.path","#{work_dir}/socket")

# enable logging
set("log.file.path", "#{work_dir}/liquidsoap.log")
set("log.stdout",true)
set("log.level", 3)

# define music and mix with jingles
music_day = playlist('#{music_day_dir}/day.m3u', mode="normal")
music_night = playlist('#{music_night_dir}/night.m3u', mode="normal")

jingles = playlist('#{jingles_dir}')

stable = playlist.safe('#{stable_dir}')

day = rotate (weights = [1, 2], [jingles, music_day])
night = rotate (weights = [1, 2], [jingles, music_night])

# define live input
live_stream = strip_blank(input.http("http://localhost:15002/live.ogg"))

# schedule
scheduled_stream = switch([ ({23h-23h10}, night), ({23h10m-23h}, day) ])

# stable cast
stable_stream = stable;

# fallback output with
radio = fallback(track_sensitive=false,
[live_stream, scheduled_stream, stable_stream])

out(
  %mp3(bitrate = 320, id3v2 = true),
  description = "MP3 320 Kbps",
  mount = "stream",
  mksafe(radio)
)




