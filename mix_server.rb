require 'rubygems'
require 'sinatra'
require 'digest/sha1'
require 'json'

set_option :sessions, true

class App
  def self.beatmatch(song, bpm)
    song_name_segments = song.split("/")
    song_name = song_name_segments[song_name_segments.length-1].split(".")[0]
    dir = "/Users/dan/code/ruby/pick_n_mixer/public/music/" + song_name + "-" + bpm + "/"  
    puts dir
    unless (File.directory? dir)
      system('rm -Rf ' + dir)
      FileUtils.mkdir_p(dir)
      system('ECHO_NEST_API_KEY="MRG4LEHA7MI0LHNDD" python ~/code/python/beatmatch_bars.py ' + song + ' ' + dir + 'b.mp3 ' + bpm + '')
    end
  end
end

get '/ls' do
  if params[:sort]
    `ls #{params[:dir]}`.split("\n").sort_by { |f| f.split(".")[0].split("-")[1].to_i }.to_json
    #Dir.new(params[:dir]).entries.sort.to_json
  else
    `ls #{params[:dir]}`.split("\n").to_json
  end
end

get '/' do
  App.beatmatch(params[:tracka], params[:bpm]) if params[:tracka]
  App.beatmatch(params[:trackb], params[:bpm]) if params[:trackb]
  App.beatmatch(params[:trackc], params[:bpm]) if params[:trackc]
  @keys = [:a, :b, :c]
  erb :index
end

get '/mix' do  
  salt = Digest::SHA1.hexdigest(params[:data])[0..5]
  command = 'ECHO_NEST_API_KEY="MRG4LEHA7MI0LHNDD" python ~/code/python/mix.py "a:' + params[:tracka] + ',b:' + params[:trackb] + ',c:' + params[:trackc] + '" ~/code/ruby/pick_n_mixer/public/music/mix-' + salt + '.mp3 ' + params[:bpm] + ' "' + params[:data] + '"'
  puts command
  system(command)  
  salt
end

get '/beatmatch_bars' do
  App.beatmatch(params[:tracka], params[:bpm]) if params[:tracka]
  App.beatmatch(params[:trackb], params[:bpm]) if params[:trackb]
  "Done!"
end
